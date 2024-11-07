import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

type JwTTokens = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const foundUser: User | null = await this.userService.findByEmail(signInDto.email);

    if (!foundUser) {
      throw new BadRequestException('User does not exist');
    }

    const passwordsMatch: boolean = await this.userService.verifyPassword(
      signInDto.password,
      foundUser.password,
    );

    if (!passwordsMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const tokens: JwTTokens = await this.getTokens(foundUser.id, foundUser.email);

    await this.userService.updateRefreshToken(foundUser.id, tokens.refreshToken);

    return tokens;
  }

  async signUp(signUpDto: SignUpDto) {
    const foundUser: User | null = await this.userService.findByEmail(signUpDto.email);

    if (foundUser) {
      throw new BadRequestException('User already exists');
    }

    const newUser: User = await this.userService.createUser(signUpDto.email, signUpDto.password);

    const tokens: JwTTokens = await this.getTokens(newUser.id, newUser.email);

    await this.userService.updateRefreshToken(newUser.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.userService.clearRefreshToken(userId);
  }

  async refreshToken(userId: string, refreshToken: string) {
    const foundUser = await this.userService.findById(userId);

    if (!foundUser || !foundUser.refreshToken) {
      throw new ForbiddenException('Access denied');
    }

    const refreshTokensMatches: boolean = await this.userService.verifyRefreshToken(
      refreshToken,
      foundUser.refreshToken,
    );

    if (!refreshTokensMatches) {
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.getTokens(foundUser.id, foundUser.email);

    return tokens;
  }

  async getTokens(userId: string, userEmail: string): Promise<JwTTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email: userEmail,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email: userEmail,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}

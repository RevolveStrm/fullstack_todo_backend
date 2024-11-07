import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtPayload } from 'src/@types/jwt-payload';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/guards/refresh-token.guard';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('sign-in')
	@ApiBody({
		type: SignInDto,
	})
	async signIn(@Body() signInDto: SignInDto) {
		return this.authService.signIn(signInDto);
	}

	@Post('sign-up')
	@ApiBody({
		type: SignUpDto,
	})
	async signUp(@Body() signUpDto: SignUpDto) {
		return this.authService.signUp(signUpDto);
	}

	@UseGuards(AccessTokenGuard)
	@Get('logout')
	logout(@Req() req: Request) {
		const userId: string = req.user.sub;

		this.authService.logout(userId);
	}

	@UseGuards(RefreshTokenGuard)
	@Get('refresh')
	@ApiBody({
		type: RefreshTokenDto,
	})
	async refresh(@Req() req: Request) {
		const userId: string = req.user.sub;
		const refreshToken: string = req.user.refreshToken;

		return this.authService.refreshToken(userId, refreshToken);
	}
}

import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
	constructor(private prismaService: PrismaService) {}

	async createUser(email: string, password: string): Promise<User> {
		const hashedPassword: string = await hash(password, 12);

		return this.prismaService.user.create({
			data: {
				email,
				password: hashedPassword,
			},
		});
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.prismaService.user.findFirst({
			where: {
				email,
			},
		});
	}

	async findById(id: string): Promise<User | null> {
		return this.prismaService.user.findFirst({
			where: {
				id,
			},
		});
	}

	async updateRefreshToken(userId: string, refreshToken: string) {
		const hashedRefreshToken: string = await hash(refreshToken, 12);

		return this.prismaService.user.update({
			where: {
				id: userId,
			},
			data: {
				refreshToken: hashedRefreshToken,
			},
		});
	}

	async clearRefreshToken(userId: string) {
		return this.prismaService.user.update({
			where: {
				id: userId,
			},
			data: {
				refreshToken: null,
			},
		});
	}

	async verifyPassword(rawPassword: string, hashedPassword: string): Promise<boolean> {
		return await compare(rawPassword, hashedPassword);
	}

	async verifyRefreshToken(rawRefreshToken: string, hashedRefreshToken: string): Promise<boolean> {
		return await compare(rawRefreshToken, hashedRefreshToken);
	}
}

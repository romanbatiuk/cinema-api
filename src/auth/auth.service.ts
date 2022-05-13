import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose-next';
import { genSalt, hash, compare } from 'bcryptjs';
import { UserModel } from 'src/user/user.model';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

type Tokens = {
	accessToken: string;
	refreshToken: string;
};

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
		private readonly jwtService: JwtService,
	) {}

	async createUser({ email, password }: AuthDto) {
		const userByEmail = await this.userModel.findOne({ email });
		if (userByEmail) {
			throw new BadRequestException('User with this email is already in the system');
		}
		const salt = await genSalt(10);
		const newUser = new this.userModel({ email, passwordHash: await hash(password, salt) });

		const tokens = await this.getTokens(newUser.email);
		// return newUser.save();
		return {
			user: newUser,
			...tokens,
		};
	}

	async login(email: string, password) {
		const user = await this.validateUser(email, password);
		const tokens = await this.getTokens(user.email);

		return {
			user,
			...tokens,
		};
	}

	async findUser(email: string) {
		return this.userModel.findOne({ email }).exec();
	}

	async validateUser(email: string, password: string): Promise<Pick<UserModel, 'email'>> {
		const user = await this.findUser(email);
		if (!user) {
			throw new UnauthorizedException('User not found');
		}
		const isCorrectPassword = await compare(password, user.passwordHash);
		if (!isCorrectPassword) {
			throw new UnauthorizedException('Wrong password');
		}
		return { email: user.email };
	}

	async getTokens(email: string): Promise<Tokens> {
		const payload = { email };

		const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '15m' });
		const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '7d' });

		return { accessToken, refreshToken };
	}
}

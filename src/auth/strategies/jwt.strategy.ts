import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UserModel } from 'src/user/user.model';
import { InjectModel } from 'nestjs-typegoose-next';
import { ModelType } from '@typegoose/typegoose/lib/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get<string>('JWT_SECRET'),
			ignoreExpiration: true,
		});
	}

	async validate({ email }: Pick<UserModel, 'email'>) {
		return await this.UserModel.findOne({ email });
	}
}

import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose-next';
import { UserModel } from 'src/user/user.model';

@Injectable()
export class AuthService {
	constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>) {}
	async createUser({ email, password }: any) {
		const newUser = new this.userModel({ email, passwordHash: password });
		return newUser.save();
	}
}

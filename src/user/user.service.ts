import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose-next';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
	constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>) {}

	async getUserById(_id: string): Promise<UserModel> {
		return await this.userModel.findById(_id);
	}
}

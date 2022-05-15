import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { genSalt, hash } from 'bcryptjs';
import { InjectModel } from 'nestjs-typegoose-next';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
	constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>) {}

	async getUserById(_id: string) {
		const user = await this.userModel.findById(_id);
		if (!user) throw new NotFoundException('User not found');
		return user;
	}

	async updateProfile(_id: string, dto: UpdateUserDto) {
		const user = await this.getUserById(_id);

		const isSameUser = await this.userModel.findOne({ email: dto.email });

		if (isSameUser && String(_id) !== String(isSameUser._id)) {
			throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
		}

		if (dto.password) {
			const salt = await genSalt(10);
			user.passwordHash = await hash(dto.password, salt);
		}

		user.email = dto.email;

		if (dto.isAdmin || dto.isAdmin === false) {
			user.isAdmin = dto.isAdmin;
		}
		await user.save();
		return;
	}

	async getAllUsers(search?: string) {
		let options = {};

		if (search) {
			options = {
				$or: [{ email: new RegExp(search, 'i') }],
			};
		}

		return this.userModel
			.find(options)
			.select('-updatedAt -__v')
			.sort({
				createdAt: 'desc',
			})
			.exec();
	}

	async deleteUser(id: string) {
		return this.userModel.findByIdAndDelete(id).exec();
	}
}

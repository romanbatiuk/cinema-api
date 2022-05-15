import { Body, Controller, Delete, Get, Param, Put, Query } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { User } from './decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@User('_id') _id: string) {
		return this.userService.getUserById(_id);
	}

	@Put('profile')
	@Auth()
	async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
		return this.userService.updateProfile(_id, dto);
	}

	@Put(':id')
	@Auth('admin')
	async updateUser(@Param('id', IdValidationPipe) id: string, @Body() dto: UpdateUserDto) {
		return this.userService.updateProfile(id, dto);
	}

	@Get()
	@Auth('admin')
	async getUsers(@Query('search') search?: string) {
		return this.userService.getAllUsers(search);
	}

	@Get(':id')
	@Auth('admin')
	async getUser(@Param('id', IdValidationPipe) id: string) {
		return this.userService.getUserById(id);
	}

	@Delete(':id')
	@Auth('admin')
	async deleteUser(@Param('id', IdValidationPipe) id: string) {
		return this.userService.deleteUser(id);
	}
}

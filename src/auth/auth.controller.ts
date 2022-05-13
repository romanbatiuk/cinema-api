import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	async register(@Body() dto: AuthDto) {
		return this.authService.createUser(dto);
	}

	@Post('login')
	async login(@Body() { email, password }: AuthDto) {
		// const user = await this.authService.validateUser(email, password);
		return this.authService.login(email, password);
	}
}

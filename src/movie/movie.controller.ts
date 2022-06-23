import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	Type,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {
	constructor(private readonly movieService: MovieService) {}

	@Get(':slug')
	async getMovieBySlug(@Query('slug') slug: string) {
		return this.movieService.getMovieBySlug(slug);
	}

	@Get('by-actor/:actorId')
	async getMovieByActorId(@Param('actorId', IdValidationPipe) actorId: Types.ObjectId) {
		return this.movieService.getMoviesByActor(actorId);
	}

	@Post('by-genres')
	@HttpCode(200)
	async getMovieByGenres(@Body('genreIds') genreIds: Types.ObjectId[]) {
		return this.movieService.getMoviesByGenres(genreIds);
	}

	@Get()
	async getAllMoview() {
		return this.movieService.getAllMovies();
	}

	@Get('popular')
	async getPopularMovies() {
		return this.movieService.getPopularMovies();
	}

	@Put('update-count-opened')
	@HttpCode(200)
	async updateCountOpened(@Body('slug') slug: string) {
		return this.movieService.updateCountOpened(slug);
	}

	//! Admin
	@Get(':id')
	@Auth('admin')
	async getMovieById(@Param('id', IdValidationPipe) id: Types.ObjectId) {
		return this.movieService.getMovieById(id);
	}

	@Post()
	@Auth('admin')
	async createGenre(@Body() dto: CreateMovieDto) {
		return this.movieService.createMovie(dto);
	}

	@Put(':id')
	@Auth('admin')
	async updateGenre(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateMovieDto) {
		return this.movieService.updateMovie(id, dto);
	}

	@Delete(':id')
	@Auth('admin')
	async deleteGenre(@Param('id', IdValidationPipe) id: string) {
		return this.movieService.deleteMovie(id);
	}
}

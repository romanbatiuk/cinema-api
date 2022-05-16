import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreService } from './genre.service';

@Controller('genres')
export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	@Get(':slug')
	async getGengeBySlug(@Query('slug') slug: string) {
		return this.genreService.getGenreBySlug(slug);
	}

	@Get('collections')
	async getCollections() {
		return this.genreService.getCollections();
	}

	@Get()
	async getGenres() {
		return this.genreService.getAllGenres();
	}

	@Get(':id')
	@Auth('admin')
	async getGenreById(@Param('id', IdValidationPipe) id: string) {
		return this.genreService.getGenreById(id);
	}

	@Post()
	@Auth('admin')
	async createGenre(@Body() dto: CreateGenreDto) {
		return this.genreService.createGenre(dto);
	}

	@Put(':id')
	@Auth('admin')
	async updateGenre(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateGenreDto) {
		return this.genreService.updateGenre(id, dto);
	}

	@Delete(':id')
	@Auth('admin')
	async deleteUser(@Param('id', IdValidationPipe) id: string) {
		return this.genreService.deleteGenre(id);
	}
}

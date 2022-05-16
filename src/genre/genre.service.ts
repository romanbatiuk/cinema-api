import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose-next';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreModel } from './genre.model';

@Injectable()
export class GenreService {
	constructor(@InjectModel(GenreModel) private readonly genreModel: ModelType<GenreModel>) {}

	async getGenreBySlug(slug: string) {
		const genre = await this.genreModel.findOne({ slug });
		if (!genre) throw new NotFoundException('Genre not found');
		return genre;
	}

	async getAllGenres(search?: string) {
		let options = {};

		if (search) {
			options = {
				$or: [
					{ name: new RegExp(search, 'i') },
					{ slug: new RegExp(search, 'i') },
					{ description: new RegExp(search, 'i') },
				],
			};
		}

		return this.genreModel
			.find(options)
			.select('-updatedAt -__v')
			.sort({
				createdAt: 'desc',
			})
			.exec();
	}

	async getCollections() {
		const genres = await this.getAllGenres();
		const collections = genres;
		return collections;
	}

	// ! METHODS FOR ADMIN
	async getGenreById(id: string) {
		const genre = await this.genreModel.findById(id);
		if (!genre) throw new NotFoundException('Genre not found');
		return genre;
	}

	async createGenre(dto: CreateGenreDto): Promise<DocumentType<GenreModel>> {
		return this.genreModel.create(dto);
	}

	async updateGenre(id: string, dto: CreateGenreDto) {
		return await this.genreModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}

	async deleteGenre(id: string) {
		return this.genreModel.findByIdAndDelete(id).exec();
	}
}

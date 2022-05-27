import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose-next';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieModel } from './movie.model';

@Injectable()
export class MovieService {
	constructor(@InjectModel(MovieModel) private readonly movieModel: ModelType<MovieModel>) {}

	async getAllActors(search?: string) {
		let options = {};

		if (search) {
			options = {
				$or: [{ title: new RegExp(search, 'i') }],
			};
		}

		//* Aggregations

		return this.movieModel
			.find(options)
			.select('-updatedAt -__v')
			.sort({
				createdAt: 'desc',
			})
			.populate('actors genres')
			.exec();
	}

	async getMovieBySlug(slug: string) {
		const movie = await this.movieModel.findOne({ slug }).populate('actors genres').exec();
		if (!movie) throw new NotFoundException('movie not found');
		return movie;
	}

	async getMoviesByActor(actorId: string) {
		const movies = await this.movieModel.find({ actors: actorId }).exec();
		if (!movies) throw new NotFoundException('Movies not found');
		return movies;
	}

	async getMoviesByGenres(genreIds: Types.ObjectId[]) {
		const movies = await this.movieModel.find({ genres: { $in: genreIds } }).exec();
		if (!movies) throw new NotFoundException('Movies not found');
		return movies;
	}

	async updateCountOpened(slug: string) {
		const updatedCount = await this.movieModel
			.findOneAndUpdate({ slug }, { $inc: { countOpened: 1 } })
			.exec();

		if (!updatedCount) throw new NotFoundException('Movie not found');
		return updatedCount;
	}

	// ! METHODS FOR ADMIN
	async getActorById(id: string) {
		const movie = await this.movieModel.findById(id);
		if (!movie) throw new NotFoundException('Movie not found');
		return movie;
	}

	async createMovie(dto: CreateMovieDto): Promise<DocumentType<MovieModel>> {
		return this.movieModel.create(dto);
	}

	async updateMovie(id: string, dto: CreateMovieDto) {
		return await this.movieModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}

	async deleteMovie(id: string) {
		return this.movieModel.findByIdAndDelete(id).exec();
	}
}

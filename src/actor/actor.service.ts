import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose-next';
import { ActorModel } from './actor.model';
import { ActorDto } from './dto/actor.dto';

@Injectable()
export class ActorService {
	constructor(@InjectModel(ActorModel) private readonly actorModel: ModelType<ActorModel>) {}

	async getActorBySlug(slug: string) {
		const actor = await this.actorModel.findOne({ slug });
		if (!actor) throw new NotFoundException('Actor not found');
		return actor;
	}

	async getAllActors(search?: string) {
		let options = {};

		if (search) {
			options = {
				$or: [{ name: new RegExp(search, 'i') }, { slug: new RegExp(search, 'i') }],
			};
		}

		//* Aggregations

		return this.actorModel
			.find(options)
			.select('-updatedAt -__v')
			.sort({
				createdAt: 'desc',
			})
			.exec();
	}

	// ! METHODS FOR ADMIN
	async getActorById(id: string) {
		const actor = await this.actorModel.findById(id);
		if (!actor) throw new NotFoundException('Actor not found');
		return actor;
	}

	async createActor(dto: ActorDto): Promise<DocumentType<ActorModel>> {
		return this.actorModel.create(dto);
	}

	async updateActor(id: string, dto: ActorDto) {
		return await this.actorModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}

	async deleteActor(id: string) {
		return this.actorModel.findByIdAndDelete(id).exec();
	}
}

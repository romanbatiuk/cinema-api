import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { ActorService } from './actor.service';
import { ActorDto } from './dto/actor.dto';

@Controller('actor')
export class ActorController {
	constructor(private readonly actorService: ActorService) {}

	@Get(':slug')
	async getActorBySlug(@Query('slug') slug: string) {
		return this.actorService.getActorBySlug(slug);
	}

	@Get()
	async getActors() {
		return this.actorService.getAllActors();
	}

	@Get(':id')
	@Auth('admin')
	async getActorById(@Param('id', IdValidationPipe) id: string) {
		return this.actorService.getActorById(id);
	}

	@Post()
	@Auth('admin')
	async createActor(@Body() dto: ActorDto) {
		return this.actorService.createActor(dto);
	}

	@Put(':id')
	@Auth('admin')
	async updateActor(@Param('id', IdValidationPipe) id: string, @Body() dto: ActorDto) {
		return this.actorService.updateActor(id, dto);
	}

	@Delete(':id')
	@Auth('admin')
	async deleteActor(@Param('id', IdValidationPipe) id: string) {
		return this.actorService.deleteActor(id);
	}
}

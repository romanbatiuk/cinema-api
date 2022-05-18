import { prop, Ref } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { ActorModel } from 'src/actor/actor.model';

class MovieParameter {
	@prop()
	year: number;

	@prop()
	duration: number;

	@prop()
	country: string;
}

export interface UserModel extends Base {}
export class MovieModel extends TimeStamps {
	@prop()
	poster: string;

	@prop()
	bigPoster: string;

	@prop()
	title: string;

	@prop()
	description: string;

	@prop({ unique: true })
	slug: string;

	@prop({ default: 0 })
	rating?: number;

	@prop()
	videoUrl: string;

	@prop({ default: 0 })
	countOpened?: number;

	@prop({ type: () => [String] })
	genres: string[];

	@prop({ ref: () => ActorModel })
	actors: Ref<ActorModel>;

	@prop({ default: false })
	isSendTelegram?: boolean;

	@prop({ type: () => [MovieParameter], _id: false })
	parameters: MovieParameter[];
}

import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsString, ValidateNested } from 'class-validator';

class MovieParameterDto {
	@IsNumber()
	year: number;

	@IsNumber()
	duration: number;

	@IsString()
	country: string;
}

export class CreateMovieDto {
	@IsString()
	poster: string;

	@IsString()
	bigPoster: string;

	@IsString()
	title: string;

	@IsString()
	description: string;

	@IsString()
	slug: string;

	@IsString()
	videoUrl: string;

	@IsArray()
	@IsString({ each: true })
	genres: string[];

	@IsArray()
	@IsString({ each: true })
	actors: string[];

	@IsBoolean()
	isSendTelegram?: boolean;

	@IsArray()
	@ValidateNested()
	@Type(() => MovieParameterDto)
	parameters: MovieParameterDto[];
}

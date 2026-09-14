import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional } from 'class-validator';

@InputType()
export class CreateHorseInput {
  @Field({ description: 'Кличка лошади' })
  @IsString()
  name!: string;

  @Field({ description: 'Пол лошади', nullable: true })
  @IsOptional()
  @IsString()
  gender?: string;

  @Field({ description: 'Порода или масть', nullable: true })
  @IsOptional()
  @IsString()
  breed?: string;

  @Field({ description: 'Ссылка на фото', nullable: true })
  @IsOptional()
  @IsString()
  photoUrl?: string;
}
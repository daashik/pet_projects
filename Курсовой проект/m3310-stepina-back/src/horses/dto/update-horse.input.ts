import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateHorseInput } from './create-horse.input';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateHorseInput extends PartialType(CreateHorseInput) {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id!: number;
}
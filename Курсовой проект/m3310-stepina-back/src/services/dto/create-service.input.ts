import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

@InputType()
export class CreateServiceInput {
  @Field({ description: 'Название услуги' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @Field({ description: 'Описание услуги', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Int, { description: 'Цена в рублях', nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  priceRub?: number;
}
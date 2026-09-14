import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateServiceInput } from './create-service.input';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateServiceInput extends PartialType(CreateServiceInput) {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id!: number;
}
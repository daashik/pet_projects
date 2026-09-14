import { InputType, Field, Int, PartialType, OmitType } from '@nestjs/graphql';
import { CreateBookingInput } from './create-booking.input';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateBookingInput extends PartialType(CreateBookingInput) {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id!: number;
}
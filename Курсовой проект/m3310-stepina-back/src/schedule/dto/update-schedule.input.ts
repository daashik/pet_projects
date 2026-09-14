import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateScheduleInput } from './create-schedule.input';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateScheduleInput extends PartialType(CreateScheduleInput) {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id!: number;
}
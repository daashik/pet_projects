import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsISO8601 } from 'class-validator';

@InputType()
export class CreateScheduleInput {
  @Field({ description: 'Название занятия' })
  @IsString()
  @IsNotEmpty({ message: 'Название не может быть пустым' })
  title!: string;

  @Field({ description: 'Время начала (ISO8601)' })
  @IsISO8601({}, { message: 'Дата начала должна быть в формате ISO8601' })
  @IsNotEmpty({ message: 'Время начала не может быть пустым' })
  startAt!: string;

  @Field({ description: 'Время окончания (ISO8601)' })
  @IsISO8601({}, { message: 'Дата окончания должна быть в формате ISO8601' })
  @IsNotEmpty({ message: 'Время окончания не может быть пустым' })
  endAt!: string;
}
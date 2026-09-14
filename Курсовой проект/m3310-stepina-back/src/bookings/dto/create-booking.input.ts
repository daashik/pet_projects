import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class CreateBookingInput {
  @Field({ description: 'Дата в формате ISO 8601' })
  @IsString()
  @IsNotEmpty()
  date!: string;

  @Field(() => Int, { description: 'ID клиента' })
  @IsNumber()
  userId!: number;

  @Field(() => Int, { description: 'ID выбранной услуги' })
  @IsNumber()
  serviceId!: number;

  @Field(() => Int, { description: 'ID конкретной лошади', nullable: true })
  @IsOptional()
  @IsNumber()
  horseId?: number;

  @Field(() => Int, { description: 'ID временного слота', nullable: true })
  @IsOptional()
  @IsNumber()
  slotId?: number;
}
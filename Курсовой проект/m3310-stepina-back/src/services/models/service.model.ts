import { Field, ObjectType, ID, Int } from '@nestjs/graphql';
import { Booking } from '../../bookings/models/booking.model';

@ObjectType({ description: 'Предоставляемая услуга клуба' })
export class Service {
  @Field(() => ID)
  id!: number;

  @Field({ description: 'Название услуги' })
  title!: string;

  @Field({ description: 'Описание услуги', nullable: true })
  description?: string;

  @Field(() => Int, { description: 'Цена в рублях', nullable: true })
  priceRub?: number;

  @Field()
  createdAt!: Date;

  @Field(() => [Booking], { description: 'Бронирования данной услуги', nullable: true })
  bookings?: Booking[];
}
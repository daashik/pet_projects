import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Booking } from '../../bookings/models/booking.model';
import { Review } from '../../reviews/models/review.model';

@ObjectType({ description: 'Пользователь системы (клиент)' })
export class User {
  @Field(() => ID)
  id!: number;

  @Field({ description: 'Имя пользователя' })
  name!: string;

  @Field({ description: 'Электронная почта' })
  email!: string;

  @Field()
  createdAt!: Date;

  @Field(() => [Booking], { description: 'Бронирования пользователя', nullable: true })
  bookings?: Booking[];

  @Field(() => [Review], { description: 'Отзывы пользователя', nullable: true })
  reviews?: Review[];
}
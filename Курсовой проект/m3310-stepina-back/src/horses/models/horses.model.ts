import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Booking } from '../../bookings/models/booking.model';

@ObjectType({ description: 'Информация о лошади' })
export class Horse {
  @Field(() => ID)
  id!: number;

  @Field({ description: 'Кличка лошади' })
  name!: string;

  @Field({ description: 'Пол лошади', nullable: true })
  gender?: string;

  @Field({ description: 'Порода или масть', nullable: true })
  breed?: string;

  @Field({ description: 'Ссылка на фото', nullable: true })
  photoUrl?: string;

  @Field({ description: 'Дата добавления в клуб' })
  createdAt!: Date;

  @Field(() => [Booking], { description: 'Бронирования с участием этой лошади', nullable: true })
  bookings?: Booking[];
}
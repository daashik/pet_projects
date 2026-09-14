import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Booking } from '../../bookings/models/booking.model';

@ObjectType({ description: 'Временной слот расписания' })
export class ScheduleSlot {
  @Field(() => ID)
  id!: number;

  @Field({ description: 'Название занятия (например: Пн 12:00 - Группа)' })
  title!: string;

  @Field({ description: 'Время начала' })
  startAt!: Date;

  @Field({ description: 'Время окончания' })
  endAt!: Date;

  @Field()
  createdAt!: Date;

  @Field(() => [Booking], { description: 'Бронирования на этот слот', nullable: true })
  bookings?: Booking[];
}
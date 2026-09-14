import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';
import { BookingStatus } from '@prisma/client';
import { Horse } from '../../horses/models/horses.model';
import { User } from '../../users/models/user.model';
import { Service } from '../../services/models/service.model';

registerEnumType(BookingStatus, {
  name: 'BookingStatus',
  description: 'Статус бронирования (NEW, CONFIRMED, CANCELED, COMPLETED)',
});

@ObjectType({ description: 'Бронирование услуги/занятия' })
export class Booking {
  @Field(() => ID)
  id!: number;

  @Field({ description: 'Дата бронирования' })
  date!: Date;

  @Field(() => BookingStatus, { description: 'Текущий статус' })
  status!: BookingStatus;

  @Field()
  createdAt!: Date;

  @Field()
  userId!: number;

  @Field()
  serviceId!: number;

  @Field({ nullable: true })
  horseId?: number;

  @Field({ nullable: true })
  slotId?: number;

  @Field(() => User, { description: 'Клиент', nullable: true })
  user?: User;

  @Field(() => Service, { description: 'Выбранная услуга', nullable: true })
  service?: Service;

  @Field(() => Horse, { description: 'Назначенная лошадь', nullable: true })
  horse?: Horse;
}
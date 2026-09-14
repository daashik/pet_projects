import { Field, ObjectType, ID, Int } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';

@ObjectType({ description: 'Отзыв клиента' })
export class Review {
  @Field(() => ID)
  id!: number;

  @Field({ description: 'Полное имя автора отзыва' })
  fullName!: string;

  @Field({ description: 'Электронная почта для связи' })
  email!: string;

  @Field({ description: 'Текст отзыва' })
  comment!: string;

  @Field()
  createdAt!: Date;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => User, { description: 'Автор отзыва (если зарегистрирован)', nullable: true })
  user?: User;
}
import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional, IsInt } from 'class-validator';

@InputType()
export class CreateReviewInput {
  @Field({ description: 'Полное имя автора отзыва' })
  @IsString()
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  fullName!: string;

  @Field({ description: 'Электронная почта для связи' })
  @IsEmail({}, { message: 'Должна быть корректная электронная почта' })
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  email!: string;

  @Field({ description: 'Текст отзыва' })
  @IsString()
  @IsNotEmpty({ message: 'Комментарий не может быть пустым' })
  @MinLength(10, { message: 'Отзыв должен содержать не менее 10 символов' })
  comment!: string;

  @Field(() => Int, { description: 'ID пользователя (если авторизован)', nullable: true })
  @IsOptional()
  @IsInt({ message: 'ID пользователя должен быть числом' })
  userId?: number | null;
}
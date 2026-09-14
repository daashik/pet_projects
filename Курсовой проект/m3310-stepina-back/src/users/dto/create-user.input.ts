import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field({ description: 'Имя пользователя' })
  @IsString()
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  @MinLength(2, { message: 'Имя должно быть не короче 2 символов' })
  @MaxLength(100, { message: 'Имя слишком длинное' })
  name!: string;

  @Field({ description: 'Электронная почта' })
  @IsEmail({}, { message: 'Должна быть корректная электронная почта' })
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  email!: string;
}
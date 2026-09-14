import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 'Дарья', description: 'Полное имя автора отзыва' })
  @IsString()
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  fullName!: string;

  @ApiProperty({ example: 'stepina@example.com', description: 'Электронная почта для связи' })
  @IsEmail({}, { message: 'Должна быть корректная электронная почта' })
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  email!: string;

  @ApiProperty({ 
    example: 'Очень крутой клуб! Профессиональные тренеры и ухоженные лошади.', 
    description: 'Текст отзыва' 
  })
  @IsString()
  @IsNotEmpty({ message: 'Комментарий не может быть пустым' })
  @MinLength(10, { message: 'Отзыв должен содержать не менее 10 символов' })
  comment!: string;

  @ApiProperty({ 
    example: 1, 
    description: 'ID пользователя (если авторизован)', 
    required: false, 
    nullable: true 
  })
  @IsOptional()
  @IsInt({ message: 'ID пользователя должен быть числом' })
  userId?: number | null;
}
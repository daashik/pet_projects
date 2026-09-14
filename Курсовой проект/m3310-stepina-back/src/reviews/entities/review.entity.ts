import { ApiProperty } from '@nestjs/swagger';

export class ReviewEntity {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор отзыва' })
  id!: number;

  @ApiProperty({ example: 'Дарья', description: 'Имя автора' })
  fullName!: string;

  @ApiProperty({ example: 'stepina@example.com', description: 'Email автора' })
  email!: string;

  @ApiProperty({ example: 'Очень крутой клуб!', description: 'Текст отзыва' })
  comment!: string;

  @ApiProperty({ example: '2026-04-12T10:00:00.000Z', description: 'Дата создания отзыва' })
  createdAt!: Date;

  @ApiProperty({ 
    example: 1, 
    description: 'ID связанного пользователя', 
    required: false, 
    nullable: true 
  })
  userId?: number | null;
}
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  id!: number;

  @ApiProperty({ example: 'Дарья', description: 'Имя пользователя' })
  name!: string;

  @ApiProperty({ example: 'daria@example.com', description: 'Электронная почта' })
  email!: string;

  @ApiProperty({ example: '2026-04-01T09:00:00.000Z', description: 'Дата регистрации' })
  createdAt!: Date;
}
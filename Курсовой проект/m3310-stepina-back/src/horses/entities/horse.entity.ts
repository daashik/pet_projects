import { ApiProperty } from '@nestjs/swagger';

export class HorseEntity {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  id!: number;

  @ApiProperty({ example: 'Гром', description: 'Кличка лошади' })
  name!: string;

  @ApiProperty({ example: 'Жеребец', required: false, nullable: true })
  gender?: string | null;

  @ApiProperty({ example: 'Арабская чистокровная', required: false, nullable: true })
  breed?: string | null;

  @ApiProperty({ example: 'https://images.com/horse.jpg', required: false, nullable: true })
  photoUrl?: string | null;

  @ApiProperty({ example: '2026-04-08T10:00:00.000Z' })
  createdAt!: Date;
}
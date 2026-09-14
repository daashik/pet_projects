import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '@prisma/client';

export class BookingEntity {
  @ApiProperty({ example: 1, description: 'ID бронирования' })
  id!: number;

  @ApiProperty({ example: '2026-04-10T14:00:00Z', description: 'Дата и время записи' })
  date!: Date;

  @ApiProperty({ enum: BookingStatus, example: BookingStatus.NEW })
  status!: BookingStatus;

  @ApiProperty({ example: '2026-04-08T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: 5, description: 'ID пользователя' })
  userId!: number;

  @ApiProperty({ example: 2, description: 'ID услуги' })
  serviceId!: number;

  @ApiProperty({ example: 3, required: false, nullable: true, description: 'ID лошади' })
  horseId?: number | null;

  @ApiProperty({ example: 10, required: false, nullable: true, description: 'ID слота' })
  slotId?: number | null;
}
import { ApiProperty } from '@nestjs/swagger';

export class ScheduleEntity {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  id!: number;

  @ApiProperty({ example: 'Тренировка по конкуру', description: 'Название занятия' })
  title!: string;

  @ApiProperty({ example: '2026-04-07T14:00:00.000Z', description: 'Время начала' })
  startAt!: Date;

  @ApiProperty({ example: '2026-04-07T15:30:00.000Z', description: 'Время окончания' })
  endAt!: Date;

  @ApiProperty({ example: '2026-04-08T10:00:00.000Z', description: 'Дата создания записи' })
  createdAt!: Date;
}
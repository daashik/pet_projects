import { IsString, IsNotEmpty, IsISO8601 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty({ example: 'Тренировка по конкуру', description: 'Название занятия' })
  @IsString()
  @IsNotEmpty({ message: 'Название не может быть пустым' })
  title!: string;

  @ApiProperty({ 
    example: '2026-04-07T14:00:00.000Z', 
    description: 'Время начала (ISO8601)' 
  })
  @IsISO8601({}, { message: 'Дата начала должна быть в формате ISO8601' })
  @IsNotEmpty({ message: 'Время начала не может быть пустым' })
  startAt!: string;

  @ApiProperty({ 
    example: '2026-04-07T15:30:00.000Z', 
    description: 'Время окончания (ISO8601)' 
  })
  @IsISO8601({}, { message: 'Дата окончания должна быть в формате ISO8601' })
  @IsNotEmpty({ message: 'Время окончания не может быть пустым' })
  endAt!: string;
}
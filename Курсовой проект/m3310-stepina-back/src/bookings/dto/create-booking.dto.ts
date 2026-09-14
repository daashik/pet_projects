import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @ApiProperty({ 
    example: '2026-04-10T14:00:00Z', 
    description: 'Дата в формате ISO 8601' 
  })
  @IsString()
  @IsNotEmpty()
  date!: string;

  @ApiProperty({ example: 1, description: 'ID клиента' })
  @Type(() => Number)
  @IsNumber()
  userId!: number;

  @ApiProperty({ example: 2, description: 'ID выбранной услуги' })
  @Type(() => Number)
  @IsNumber()
  serviceId!: number;

  @ApiProperty({ example: 3, required: false, description: 'ID конкретной лошади' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  horseId?: number;

  @ApiProperty({ example: 10, required: false, description: 'ID временного слота' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  slotId?: number;
}
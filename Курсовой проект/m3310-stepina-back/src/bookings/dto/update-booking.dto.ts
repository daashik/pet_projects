import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBookingDto } from './create-booking.dto';
import { BookingStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @ApiProperty({ 
    enum: BookingStatus, 
    required: false, 
    example: BookingStatus.CONFIRMED,
    description: 'Статус бронирования'
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
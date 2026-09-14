import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { BookingsApiController } from './bookings.api.controller';
import { BookingsResolver } from './bookings.resolver';

@Module({
  controllers: [BookingsController, BookingsApiController],
  providers: [BookingsService, BookingsResolver],
  exports: [BookingsService],
})
export class BookingsModule {}
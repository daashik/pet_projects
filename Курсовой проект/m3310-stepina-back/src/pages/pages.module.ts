import { Module } from '@nestjs/common';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';
import { ReviewsModule } from '../reviews/reviews.module';
import { HorsesModule } from '../horses/horses.module';
import { ServicesModule } from '../services/services.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { BookingsModule } from '../bookings/bookings.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ReviewsModule,
    HorsesModule,
    ServicesModule,
    ScheduleModule,
    BookingsModule,
    UsersModule,
  ],
  controllers: [PagesController],
  providers: [PagesService],
})
export class PagesModule {}
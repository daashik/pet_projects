import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { ScheduleApiController } from './schedule.api.controller';
import { ScheduleResolver } from './schedule.resolver';

@Module({
  controllers: [ScheduleController, ScheduleApiController],
  providers: [ScheduleService, ScheduleResolver],
  exports: [ScheduleService],
})
export class ScheduleModule {}
import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { ServicesResolver } from './services.resolver';
import { ServicesApiController } from './services.api.controller';

@Module({
  controllers: [ServicesController, ServicesApiController],
  providers: [ServicesService, ServicesResolver],
  exports: [ServicesService],
})
export class ServicesModule {}
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HorsesService } from './horses.service';
import { HorsesController } from './horses.controller';
import { HorsesApiController } from './horses.api.controller';
import { HorsesResolver } from './horses.resolver';
import { S3 } from '@aws-sdk/client-s3';
import { S3Module } from '../s3/s3.module';
import { S3Controller } from '../s3/s3.controller';
import { S3Service } from '../s3/s3.service';


@Module({
  imports: [ConfigModule, S3Module],
  controllers: [HorsesController, HorsesApiController, S3Controller],
  providers: [HorsesService, HorsesResolver, S3Service],
  exports: [HorsesService],
})
export class HorsesModule {}
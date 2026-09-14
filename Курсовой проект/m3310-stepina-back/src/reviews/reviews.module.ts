import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ReviewsApiController } from './reviews.api.controller';
import { ReviewsResolver } from './reviews.resolver';

@Module({
  controllers: [ReviewsController, ReviewsApiController],
  providers: [ReviewsService, ReviewsResolver],
  exports: [ReviewsService],
})
export class ReviewsModule {}
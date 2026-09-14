import { Controller, Sse } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { interval, map } from 'rxjs';

@ApiExcludeController()
@Controller('events')
export class EventsController {
  @Sse('reviews')
  reviewsStream() {
    return interval(5000).pipe(
      map(() => ({
        data: {
          message: 'Отзывы обновлены',
          time: new Date().toLocaleTimeString(),
        },
      })),
    );
  }
}
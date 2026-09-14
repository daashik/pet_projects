import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { GqlContextType } from '@nestjs/graphql';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TimingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType<GqlContextType>() === 'graphql') {
      return next.handle();
    }

    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next
      .handle()
      .pipe(
      map(data => {
        if (response.headersSent) return data;
        const contentType = response.getHeader?.('Content-Type') ?? '';
        if (typeof contentType === 'string' && contentType.includes('text/html')) {
          return data;
        }
        return data;
      }),
      tap(() => {
        const elapsedTime = Date.now() - now;
        this.logger.log(`Request to ${request.url} took ${elapsedTime}ms`);

        if (!response.headersSent) {
          response.header?.('X-Elapsed-Time', `${elapsedTime}ms`);
        }
        }),
      );
  }
}

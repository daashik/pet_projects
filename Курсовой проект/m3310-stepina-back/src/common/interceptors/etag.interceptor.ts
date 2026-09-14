import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as crypto from 'crypto';
import { GqlContextType } from '@nestjs/graphql';

@Injectable()
export class EtagInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType<GqlContextType>() === 'graphql') {
      return next.handle(); 
    }

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const ifNoneMatch = request.headers['if-none-match'];

    return next.handle().pipe(
      map(data => {
        if (!data) return data;
        const etag = `"${crypto.createHash('md5').update(JSON.stringify(data)).digest('hex')}"`;

        if (ifNoneMatch === etag) {
          throw new HttpException('', HttpStatus.NOT_MODIFIED);
        }
        
        if (typeof response.header === 'function'){
          response.header('ETag', etag);
        }
        
        return data;
      }),
    );
  }
}

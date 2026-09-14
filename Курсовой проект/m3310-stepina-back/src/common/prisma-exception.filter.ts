import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    this.logger.error(`Prisma Error: ${exception.code} - ${exception.message}`);

    if (host.getType<string>() === 'graphql') {
      return exception;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorMapping = {
      P2002: {
        status: HttpStatus.CONFLICT,
        message: 'Запись с такими данными уже существует. Пожалуйста, проверьте введённую информацию.',
        error: 'Conflict',
      },
      P2003: {
        status: HttpStatus.BAD_REQUEST,
        message: 'Невозможно выполнить операцию: нарушена связь между данными. Убедитесь, что все зависимости корректны.',
        error: 'Bad Request',
      },
      P2025: {
        status: HttpStatus.NOT_FOUND,
        message: 'Запрашиваемый ресурс не найден или был удален.',
        error: 'Not Found',
      },
    };

    const { status, message, error } = errorMapping[exception.code] || {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.',
      error: 'Internal Server Error',
    };

    return response.status(status).json({
      statusCode: status,
      message,
      error,
    });
  }
}
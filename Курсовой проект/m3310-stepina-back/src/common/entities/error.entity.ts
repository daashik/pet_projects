import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponse {
  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({ example: 'Имя слишком короткое' })
  message!: string | string[];

  @ApiProperty({ example: 'Bad Request' })
  error!: string;
}

export class NotFoundResponse {
  @ApiProperty({ example: 404 })
  statusCode!: number;

  @ApiProperty({ example: 'Лошадь с таким ID не найдена' })
  message!: string;

  @ApiProperty({ example: 'Not Found' })
  error!: string;
}

export class InternalServerErrorResponse {
  @ApiProperty({ example: 500 })
  statusCode!: number;

  @ApiProperty({ example: 'Ошибка базы данных' })
  message!: string;

  @ApiProperty({ example: 'Internal Server Error' })
  error!: string;
}
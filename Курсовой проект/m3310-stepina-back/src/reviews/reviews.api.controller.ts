import { Body, Controller, Delete, Get, Param, Post, Query, ParseIntPipe, Res, HttpCode, HttpStatus, Header, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse, ApiCreatedResponse, ApiNoContentResponse, ApiSecurity } from '@nestjs/swagger';
import { Response } from 'express';

import { EtagInterceptor } from '../common/interceptors/etag.interceptor';

import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { PaginationDto } from '../common/utils/pagination.dto';
import { setPaginationHeader } from '../common/utils/pagination.header';
import { ReviewEntity } from './entities/review.entity';
import { BadRequestResponse, NotFoundResponse, InternalServerErrorResponse } from '../common/entities/error.entity';

import { PublicAccess } from '../auth/public-access.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, Role } from '../auth/roles.decorator';
import { UseGuards } from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Reviews (API)')
@Controller('api/reviews')
export class ReviewsApiController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @PublicAccess()
  @ApiOperation({ summary: 'Получить список всех отзывов с пагинацией' })
  @ApiOkResponse({ description: 'Успешный возврат списка', type: [ReviewEntity] })
  @ApiResponse({ status: 500, description: 'Ошибка базы данных', type: InternalServerErrorResponse })
  //
  @Header('Cache-Control', 'public, max-age=120')
  @UseInterceptors(EtagInterceptor) 
  async findAll(
    @Query() pagination: PaginationDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, total } = await this.reviewsService.findAll(pagination);
    setPaginationHeader(res, total, pagination.skip || 0, pagination.take || 10, 'http://localhost:3001/api/reviews');
    res.setHeader('X-Total-Count', total.toString());
    return data;
  }

  @Post()
  @PublicAccess()
  @ApiOperation({ summary: 'Создать новый отзыв' })
  @ApiCreatedResponse({ description: 'Отзыв успешно опубликован', type: ReviewEntity })
  @ApiResponse({ status: 400, description: 'Некорректные входные данные', type: BadRequestResponse })
  @ApiBearerAuth('bearer')
  async create(@Body() body: CreateReviewDto) {
    return await this.reviewsService.create(body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  // @UseGuards(RolesGuard)
  // @Roles(Role.Admin)
  @ApiOperation({ summary: 'Удалить отзыв из базы' })
  @ApiNoContentResponse({ description: 'Отзыв успешно удален' })
  @ApiResponse({ status: 400, description: 'Некорректный формат ID', type: BadRequestResponse })
  @ApiResponse({ status: 404, description: 'Отзыв для удаления не найден', type: NotFoundResponse })
  @ApiBearerAuth('bearer')
  async remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number) {
    await this.reviewsService.remove(id);
  }
}
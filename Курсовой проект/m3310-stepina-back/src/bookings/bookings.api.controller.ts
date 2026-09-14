import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe, Query, Res, HttpCode, HttpStatus, Header, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse, ApiCreatedResponse, ApiNoContentResponse, ApiSecurity } from '@nestjs/swagger';
import { Response } from 'express';

import { EtagInterceptor } from '../common/interceptors/etag.interceptor';

import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PaginationDto } from '../common/utils/pagination.dto';
import { setPaginationHeader } from '../common/utils/pagination.header';
import { BookingEntity } from './entities/booking.entity';
import { BadRequestResponse, NotFoundResponse, InternalServerErrorResponse } from '../common/entities/error.entity';

import { PublicAccess } from '../auth/public-access.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, Role } from '../auth/roles.decorator';
import { UseGuards } from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Bookings (API)')
@Controller('api/bookings')
export class BookingsApiController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @PublicAccess()
  @ApiOperation({ summary: 'Получить список всех бронирований с пагинацией' })
  @ApiOkResponse({ description: 'Успешный возврат списка', type: [BookingEntity] })
  @ApiResponse({ status: 500, description: 'Ошибка сервера', type: InternalServerErrorResponse })
  //
  @Header('Cache-Control', 'private, max-age=60')
  @UseInterceptors(EtagInterceptor)
  async findAll(
    @Query() pagination: PaginationDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, total } = await this.bookingsService.findAll(pagination);
    
    setPaginationHeader(
      res, 
      total, 
      pagination.skip || 0, 
      pagination.take || 10, 
      'http://localhost:3001/api/bookings'
    );
    
    res.setHeader('X-Total-Count', total.toString());
    return data;
  }

  @Get(':id')
  @PublicAccess()
  @ApiOperation({ summary: 'Получить детали конкретного бронирования' })
  @ApiOkResponse({ description: 'Данные успешно получены', type: BookingEntity })
  @ApiResponse({ status: 400, description: 'Некорректный формат ID', type: BadRequestResponse })
  @ApiResponse({ status: 404, description: 'Бронирование не найдено', type: NotFoundResponse })
  //
  @Header('Cache-Control', 'private, max-age=60')
  @UseInterceptors(EtagInterceptor)
  async findOne(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number
  ) {
    return await this.bookingsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать новое бронирование' })
  @ApiCreatedResponse({ description: 'Бронирование успешно создано', type: BookingEntity })
  @ApiResponse({ status: 400, description: 'Некорректные входные данные', type: BadRequestResponse })
  @ApiBearerAuth('bearer')
  async create(@Body() body: CreateBookingDto) {
    return await this.bookingsService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить данные бронирования' })
  @ApiOkResponse({ description: 'Данные успешно обновлены', type: BookingEntity })
  @ApiResponse({ status: 400, description: 'Некорректные данные или ID', type: BadRequestResponse })
  @ApiResponse({ status: 404, description: 'Бронирование для обновления не найдено', type: NotFoundResponse })
  @ApiBearerAuth('bearer')
  async update(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number, 
    @Body() body: UpdateBookingDto
  ) {
    return await this.bookingsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  // @UseGuards(RolesGuard)
  // @Roles(Role.Admin)
  @ApiOperation({ summary: 'Удалить бронирование' })
  @ApiNoContentResponse({ description: 'Бронирование успешно удалено' })
  @ApiResponse({ status: 400, description: 'Некорректный формат ID', type: BadRequestResponse })
  @ApiResponse({ status: 404, description: 'Бронирование для удаления не найдено', type: NotFoundResponse })
  @ApiBearerAuth('bearer')
  async remove(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number
  ) {
    await this.bookingsService.remove(id);
  }
}
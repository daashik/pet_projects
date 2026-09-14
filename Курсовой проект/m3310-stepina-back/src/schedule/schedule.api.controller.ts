import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ParseIntPipe, Res, HttpCode, HttpStatus, Header, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse, ApiCreatedResponse, ApiNoContentResponse, ApiSecurity } from '@nestjs/swagger';
import { Response } from 'express';

import { EtagInterceptor } from '../common/interceptors/etag.interceptor';

import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PaginationDto } from '../common/utils/pagination.dto';
import { setPaginationHeader } from '../common/utils/pagination.header';
import { ScheduleEntity } from './entities/schedule.entity';
import { BadRequestResponse, NotFoundResponse, InternalServerErrorResponse } from '../common/entities/error.entity';

import { PublicAccess } from '../auth/public-access.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, Role } from '../auth/roles.decorator';
import { UseGuards } from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Schedule (API)')
@Controller('api/schedule')
export class ScheduleApiController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  @PublicAccess()
  @ApiOperation({ summary: 'Получить список всех записей расписания с пагинацией' })
  @ApiOkResponse({ description: 'Успешный возврат списка', type: [ScheduleEntity] })
  @ApiResponse({ status: 500, description: 'Ошибка базы данных', type: InternalServerErrorResponse })
  //
  @Header('Cache-Control', 'public, max-age=60')
  @UseInterceptors(EtagInterceptor)
  async findAll(
    @Query() pagination: PaginationDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, total } = await this.scheduleService.findAll(pagination);
    setPaginationHeader(res, total, pagination.skip || 0, pagination.take || 10, 'http://localhost:3001/api/schedule');
    res.setHeader('X-Total-Count', total.toString());
    return data;
  }

  @Get(':id')
  @PublicAccess()
  @ApiOperation({ summary: 'Получить детали конкретной записи' })
  @ApiOkResponse({ description: 'Успешный возврат данных', type: ScheduleEntity })
  @ApiResponse({ status: 400, description: 'Некорректный формат ID', type: BadRequestResponse })
  @ApiResponse({ status: 404, description: 'Запись не найдена', type: NotFoundResponse })
  //
  @Header('Cache-Control', 'public, max-age=300')
  @UseInterceptors(EtagInterceptor)
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number) {
    return await this.scheduleService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать новую запись в расписании' })
  @ApiCreatedResponse({ description: 'Запись успешно создана', type: ScheduleEntity })
  @ApiResponse({ status: 400, description: 'Некорректные входные данные', type: BadRequestResponse })
  @ApiBearerAuth('bearer')
  async create(@Body() body: CreateScheduleDto) {
    return await this.scheduleService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить данные записи' })
  @ApiOkResponse({ description: 'Данные успешно обновлены', type: ScheduleEntity })
  @ApiResponse({ status: 400, description: 'Некорректные данные или ID', type: BadRequestResponse })
  @ApiResponse({ status: 404, description: 'Запись для обновления не найдена', type: NotFoundResponse })
  @ApiBearerAuth('bearer')
  async update(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number, 
    @Body() body: UpdateScheduleDto
  ) {
    return await this.scheduleService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  // @UseGuards(RolesGuard)
  // @Roles(Role.Admin)
  @ApiOperation({ summary: 'Удалить запись из расписания' })
  @ApiNoContentResponse({ description: 'Запись успешно удалена' })
  @ApiResponse({ status: 400, description: 'Некорректный формат ID', type: BadRequestResponse })
  @ApiResponse({ status: 404, description: 'Запись для удаления не найдена', type: NotFoundResponse })
  @ApiBearerAuth('bearer')
  async remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number) {
    await this.scheduleService.remove(id);
  }
}
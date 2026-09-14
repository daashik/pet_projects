import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ParseIntPipe, Res, HttpCode, HttpStatus, Header, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse, ApiCreatedResponse, ApiNoContentResponse, ApiSecurity } from '@nestjs/swagger';
import { Response } from 'express';

import { CacheInterceptor } from '@nestjs/cache-manager';
import { EtagInterceptor } from '../common/interceptors/etag.interceptor';

import { HorsesService } from './horses.service';
import { CreateHorseDto } from './dto/create-horse.dto';
import { UpdateHorseDto } from './dto/update-horse.dto';
import { PaginationDto } from '../common/utils/pagination.dto';
import { setPaginationHeader } from '../common/utils/pagination.header';
import { HorseEntity } from './entities/horse.entity';
import { BadRequestResponse, NotFoundResponse, InternalServerErrorResponse } from '../common/entities/error.entity';

import { PublicAccess } from '../auth/public-access.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, Role } from '../auth/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Horses (API)')
@Controller('api/horses')
export class HorsesApiController {
  constructor(private readonly horsesService: HorsesService) {}

  @Get()
  @PublicAccess()
  @ApiOperation({ summary: 'Получить список всех лошадей с пагинацией' })
  @ApiOkResponse({ description: 'Успешный возврат списка', type: [HorseEntity] })
  @ApiResponse({ status: 500, description: 'Ошибка базы данных', type: InternalServerErrorResponse })
  //
  @Header('Cache-Control', 'public, max-age=60')
  @UseInterceptors(EtagInterceptor)
  @UseInterceptors(CacheInterceptor)  
  async findAll(
    @Query() pagination: PaginationDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, total } = await this.horsesService.findAll(pagination);
    setPaginationHeader(res, total, pagination.skip || 0, pagination.take || 10, 'http://localhost:3001/api/horses');
    res.setHeader('X-Total-Count', total.toString());
    return data;
  }

  @Get(':id')
  @PublicAccess()
  @ApiOperation({ summary: 'Получить данные конкретной лошади' })
  @ApiOkResponse({ description: 'Успешный возврат данных', type: HorseEntity })
  @ApiResponse({ status: 400, description: 'Некорректный формат ID', type: BadRequestResponse })
  @ApiResponse({ status: 404, description: 'Лошадь с таким ID не найдена', type: NotFoundResponse })
  //
  @Header('Cache-Control', 'public, max-age=3600') 
  @UseInterceptors(EtagInterceptor)
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number) {
    return await this.horsesService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Создать новую запись о лошади' })
  @ApiCreatedResponse({ description: 'Успешное создание', type: HorseEntity })
  @ApiResponse({ status: 400, description: 'Некорректные входные данные', type: BadRequestResponse })
  @ApiBearerAuth('bearer')
  async create(@Body() body: CreateHorseDto) {
    return await this.horsesService.create(body);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Обновить данные лошади' })
  @ApiOkResponse({ description: 'Успешное обновление', type: HorseEntity })
  @ApiResponse({ status: 400, description: 'Некорректные данные или ID', type: BadRequestResponse })
  @ApiResponse({ status: 404, description: 'Лошадь для обновления не найдена', type: NotFoundResponse })
  @ApiBearerAuth('bearer')
  async update(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number, 
    @Body() body: UpdateHorseDto
  ) {
    return await this.horsesService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  // @UseGuards(RolesGuard)
  // @Roles(Role.Admin)
  @ApiOperation({ summary: 'Удалить лошадь из базы' })
  @ApiNoContentResponse({ description: 'Успешное удаление' })
  @ApiResponse({ status: 400, description: 'Некорректный формат ID', type: BadRequestResponse })
  @ApiResponse({ status: 404, description: 'Лошадь для удаления не найдена', type: NotFoundResponse })
  @ApiBearerAuth('bearer')
  async remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number) {
    await this.horsesService.remove(id);
  }
}
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ParseIntPipe, Res, HttpCode, HttpStatus, Header, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiNoContentResponse, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { Response } from 'express';

import { EtagInterceptor } from '../common/interceptors/etag.interceptor';

import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PaginationDto } from '../common/utils/pagination.dto';
import { setPaginationHeader } from '../common/utils/pagination.header';
import { ServiceEntity } from './entities/service.entity';
import { BadRequestResponse, NotFoundResponse, InternalServerErrorResponse } from '../common/entities/error.entity';

import { PublicAccess } from '../auth/public-access.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, Role } from '../auth/roles.decorator';
import { UseGuards } from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Services (API)')
@Controller('api/services')
export class ServicesApiController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @PublicAccess()
  @ApiOperation({ summary: 'Получить список всех услуг с пагинацией' })
  @ApiOkResponse({ description: 'Успешный возврат списка', type: [ServiceEntity] })
  @ApiResponse({ status: 500, description: 'Ошибка базы данных', type: InternalServerErrorResponse })
  //
  @Header('Cache-Control', 'public, max-age=86400') // 1 день (24 * 60 * 60 = 86400 секунд)
  @UseInterceptors(EtagInterceptor)
  async findAll(
    @Query() pagination: PaginationDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, total } = await this.servicesService.findAll(pagination);
    
    setPaginationHeader(
      res, 
      total, 
      pagination.skip || 0, 
      pagination.take || 10, 
      'http://localhost:3001/api/services'
    );
    
    res.setHeader('X-Total-Count', total.toString());
    return data;
  }

  @Get(':id')
  @PublicAccess()
  @ApiOperation({ summary: 'Получить данные конкретной услуги' })
  @ApiOkResponse({ description: 'Успешный возврат данных', type: ServiceEntity })
  @ApiResponse({ status: 400, description: 'Некорректный формат ID', type: BadRequestResponse })
  @ApiResponse({ status: 404, description: 'Услуга с таким ID не найдена', type: NotFoundResponse })
  //
  @Header('Cache-Control', 'public, max-age=86400')
  @UseInterceptors(EtagInterceptor)
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number) {
    return await this.servicesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать новую услугу' })
  @ApiCreatedResponse({ description: 'Успешное создание', type: ServiceEntity })
  @ApiResponse({ status: 400, description: 'Некорректные входные данные', type: BadRequestResponse })
  @ApiBearerAuth('bearer')
  async create(@Body() body: CreateServiceDto) {
    return await this.servicesService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить данные услуги' })
  @ApiOkResponse({ description: 'Успешное обновление', type: ServiceEntity })
  @ApiResponse({ status: 400, description: 'Некорректные данные или ID', type: BadRequestResponse })
  @ApiResponse({ status: 404, description: 'Услуга для обновления не найдена', type: NotFoundResponse })
  @ApiBearerAuth('bearer')
  async update(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number, 
    @Body() body: UpdateServiceDto
  ) {
    return await this.servicesService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  // @UseGuards(RolesGuard)
  // @Roles(Role.Admin)
  @ApiOperation({ summary: 'Удалить услугу из базы' })
  @ApiNoContentResponse({ description: 'Успешное удаление' })
  @ApiResponse({ status: 400, description: 'Некорректный формат ID', type: BadRequestResponse })
  @ApiResponse({ status: 404, description: 'Услуга для удаления не найдена', type: NotFoundResponse })
  @ApiBearerAuth('bearer')
  async remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number) {
    await this.servicesService.remove(id);
  }
}
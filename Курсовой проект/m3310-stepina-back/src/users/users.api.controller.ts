import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ParseIntPipe, Res, HttpCode, HttpStatus, Header, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse, ApiCreatedResponse, ApiNoContentResponse, ApiSecurity } from '@nestjs/swagger';
import { Response } from 'express';

import { EtagInterceptor } from '../common/interceptors/etag.interceptor';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/utils/pagination.dto';
import { setPaginationHeader } from '../common/utils/pagination.header';
import { UserEntity } from './entities/user.entity';
import { BadRequestResponse, NotFoundResponse, InternalServerErrorResponse } from '../common/entities/error.entity';

import { PublicAccess } from '../auth/public-access.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, Role } from '../auth/roles.decorator';
import { UseGuards } from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users (API)')
@Controller('api/users')
export class UsersApiController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @PublicAccess()
  @ApiOperation({ summary: 'Получить список всех пользователей с пагинацией' })
  @ApiOkResponse({ description: 'Успешный возврат списка', type: [UserEntity] })
  @ApiResponse({ status: 500, description: 'Ошибка базы данных', type: InternalServerErrorResponse })
  //
  @Header('Cache-Control', 'private, max-age=60')
  @UseInterceptors(EtagInterceptor)
  async findAll(
    @Query() pagination: PaginationDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { data, total } = await this.usersService.findAll(pagination);
    setPaginationHeader(res, total, pagination.skip || 0, pagination.take || 10, 'http://localhost:3001/api/users');
    res.setHeader('X-Total-Count', total.toString());
    return data;
  }

  @Get(':id')
  @PublicAccess()
  @ApiOperation({ summary: 'Получить данные конкретного пользователя' })
  @ApiOkResponse({ description: 'Успешный возврат данных', type: UserEntity })
  @ApiResponse({ status: 400, description: 'Некорректный формат ID', type: BadRequestResponse })
  @ApiResponse({ status: 404, description: 'Пользователь не найден', type: NotFoundResponse })
  //
  @Header('Cache-Control', 'private, max-age=300')
  @UseInterceptors(EtagInterceptor)
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number) {
    return await this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать нового пользователя' })
  @ApiCreatedResponse({ description: 'Успешное создание', type: UserEntity })
  @ApiResponse({ status: 400, description: 'Некорректные входные данные', type: BadRequestResponse })
  @ApiBearerAuth('bearer')
  async create(@Body() body: CreateUserDto) {
    return await this.usersService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить данные пользователя' })
  @ApiOkResponse({ description: 'Успешное обновление', type: UserEntity })
  @ApiResponse({ status: 400, description: 'Некорректные данные или ID', type: BadRequestResponse })
  @ApiResponse({ status: 404, description: 'Пользователь не найден', type: NotFoundResponse })
  @ApiBearerAuth('bearer')
  async update(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number, 
    @Body() body: UpdateUserDto
  ) {
    return await this.usersService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  // @UseGuards(RolesGuard)
  // @Roles(Role.Admin)
  @ApiOperation({ summary: 'Удалить пользователя из базы' })
  @ApiNoContentResponse({ description: 'Успешное удаление' })
  @ApiResponse({ status: 400, description: 'Некорректный формат ID', type: BadRequestResponse })
  @ApiResponse({ status: 404, description: 'Пользователь не найден', type: NotFoundResponse })
  @ApiBearerAuth('bearer')
  async remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number) {
    await this.usersService.remove(id);
  }
}
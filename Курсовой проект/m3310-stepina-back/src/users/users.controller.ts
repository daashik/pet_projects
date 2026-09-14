import { Controller, Get, Param, Post, Body, Res, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiExcludeController()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsersPage(@Res() res: Response) {
    const { data } = await this.usersService.findAll({ skip: 0, take: 50 });
    return res.render('pages/users', { users: data });
  }

  @Get('add')
  async addPage(@Res() res: Response) {
    return res.render('pages/user-add');
  }

  @Get(':id')
  async getUserDetailsPage(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const user = await this.usersService.findOne(id);
      return res.render('pages/user-details', { user });
    } catch {
      return res.status(HttpStatus.NOT_FOUND).send('Пользователь не найден');
    }
  }

  @Get(':id/edit')
  async editPage(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const user = await this.usersService.findOne(id);
      return res.render('pages/user-edit', { user });
    } catch {
      return res.status(HttpStatus.NOT_FOUND).send('Пользователь для редактирования не найден');
    }
  }

  @Post()
  async create(@Body() body: CreateUserDto, @Res() res: Response) {
    await this.usersService.create(body);
    return res.redirect('/users');
  }

  @Post(':id/edit')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() body: UpdateUserDto, 
    @Res() res: Response
  ) {
    await this.usersService.update(id, body);
    return res.redirect('/users');
  }

  @Post(':id/delete')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.usersService.remove(id);
    return res.redirect('/users');
  }
}
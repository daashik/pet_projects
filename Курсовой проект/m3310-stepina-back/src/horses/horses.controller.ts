import { Controller, Get, Param, Post, Body, Res, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Response } from 'express';
import { HorsesService } from './horses.service';
import { CreateHorseDto } from './dto/create-horse.dto';
import { UpdateHorseDto } from './dto/update-horse.dto';

@ApiExcludeController()
@Controller('horses')
export class HorsesController {
  constructor(private readonly horsesService: HorsesService) {}

  @Get()
  async getHorsesPage(@Res() res: Response) {
    const { data } = await this.horsesService.findAll({ skip: 0, take: 50 });
    // 1. Настоящие лошади
    const realHorses = data.filter(horse => horse.name !== 'GALLERY_ONLY');
    // 2. Все фото
    const allPhotos = data.filter(horse => horse.photoUrl && horse.photoUrl !== '');
    return res.render('pages/horses', { 
      realHorses: realHorses, 
      allPhotos: allPhotos 
    });
  }

  @Get('add')
  async addPage(@Res() res: Response) {
    return res.render('pages/horse-add');
  }

  @Get(':id')
  async getHorseDetailsPage(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const horse = await this.horsesService.findOne(id);
      return res.render('pages/horse-details', { horse });
    } catch {
      return res.status(HttpStatus.NOT_FOUND).send('Лошадь не найдена');
    }
  }

  @Get(':id/edit')
  async editPage(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const horse = await this.horsesService.findOne(id);
      return res.render('pages/horse-edit', { horse });
    } catch {
      return res.status(HttpStatus.NOT_FOUND).send('Запись для редактирования не найдена');
    }
  }

  @Post()
  async create(@Body() body: CreateHorseDto, @Res() res: Response) {
    await this.horsesService.create(body);
    return res.redirect('/horses');
  }

  @Post(':id/edit')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() body: UpdateHorseDto, 
    @Res() res: Response
  ) {
    await this.horsesService.update(id, body);
    return res.redirect('/horses');
  }

  @Post(':id/delete')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.horsesService.remove(id);
    return res.redirect('/horses');
  }
}
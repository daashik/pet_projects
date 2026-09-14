import { Controller, Get, Param, Post, Body, Res, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Response } from 'express';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@ApiExcludeController()
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  async getSchedulePage(@Res() res: Response) {
    const { data } = await this.scheduleService.findAll({ skip: 0, take: 50 });
    return res.render('pages/schedule-index', { slots: data });
  }

  @Get('add')
  async addPage(@Res() res: Response) {
    return res.render('pages/schedule-add');
  }

  @Get(':id')
  async getScheduleDetailsPage(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const slot = await this.scheduleService.findOne(id);
      return res.render('pages/schedule-details', { slot });
    } catch {
      return res.status(HttpStatus.NOT_FOUND).send('Запись не найдена');
    }
  }

  @Get(':id/edit')
  async editPage(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const slot = await this.scheduleService.findOne(id);
      return res.render('pages/schedule-edit', { slot });
    } catch {
      return res.status(HttpStatus.NOT_FOUND).send('Запись для редактирования не найдена');
    }
  }

  @Post()
  async create(@Body() body: CreateScheduleDto, @Res() res: Response) {
    await this.scheduleService.create(body);
    return res.redirect('/schedule');
  }

  @Post(':id/edit')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() body: UpdateScheduleDto, 
    @Res() res: Response
  ) {
    await this.scheduleService.update(id, body);
    return res.redirect('/schedule');
  }

  @Post(':id/delete')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.scheduleService.remove(id);
    return res.redirect('/schedule');
  }
}
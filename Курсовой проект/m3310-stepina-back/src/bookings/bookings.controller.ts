import { Controller, Get, Param, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Response } from 'express';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@ApiExcludeController()
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  async findAllPage(@Res() res: Response) {
    const { data } = await this.bookingsService.findAll({ skip: 0, take: 10 });
    return res.render('pages/index', { slots: data });
  }

  @Get('add')
  async addPage(@Res() res: Response) {
    return res.render('pages/booking-add');
  }

  @Get(':id')
  async findOnePage(@Param('id') id: string, @Res() res: Response) {
    try {
      const slot = await this.bookingsService.findOne(+id);
      return res.render('pages/booking-details', { slot });
    } catch {
      return res.status(HttpStatus.NOT_FOUND).send('Бронирование не найдено');
    }
  }

  @Get(':id/edit')
  async editPage(@Param('id') id: string, @Res() res: Response) {
    try {
      const slot = await this.bookingsService.findOne(+id);
      return res.render('pages/booking-edit', { slot });
    } catch {
      return res.status(HttpStatus.NOT_FOUND).send('Запись для редактирования не найдена');
    }
  }

  @Post()
  async createPage(@Body() body: CreateBookingDto, @Res() res: Response) {
    await this.bookingsService.create(body);
    return res.redirect('/bookings');
  }

  @Post(':id/edit')
  async updatePage(@Param('id') id: string, @Body() body: UpdateBookingDto, @Res() res: Response) {
    await this.bookingsService.update(+id, body);
    return res.redirect(`/bookings/${id}`);
  }

  @Post(':id/delete')
  async removeFromPage(@Param('id') id: string, @Res() res: Response) {
    await this.bookingsService.remove(+id);
    return res.redirect('/bookings');
  }
}
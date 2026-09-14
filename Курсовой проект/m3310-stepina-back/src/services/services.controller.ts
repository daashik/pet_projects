import { Controller, Get, Param, Post, Body, Res, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Response } from 'express';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@ApiExcludeController()
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getServicesPage(@Res() res: Response) {
    const { data } = await this.servicesService.findAll({ skip: 0, take: 50 });
    return res.render('pages/services', { services: data });
  }

  @Get('add')
  async addPage(@Res() res: Response) {
    return res.render('pages/service-add');
  }

  @Get(':id')
  async getServiceDetailsPage(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const service = await this.servicesService.findOne(id);
      return res.render('pages/service-details', { service });
    } catch {
      return res.status(HttpStatus.NOT_FOUND).send('Услуга не найдена');
    }
  }

  @Get(':id/edit')
  async editPage(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const service = await this.servicesService.findOne(id);
      return res.render('pages/service-edit', { service });
    } catch {
      return res.status(HttpStatus.NOT_FOUND).send('Услуга для редактирования не найдена');
    }
  }

  @Post()
  async create(@Body() body: CreateServiceDto, @Res() res: Response) {
    await this.servicesService.create(body);
    return res.redirect('/services');
  }

  @Post(':id/edit')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() body: UpdateServiceDto, 
    @Res() res: Response
  ) {
    await this.servicesService.update(id, body);
    return res.redirect('/services');
  }

  @Post(':id/delete')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.servicesService.remove(id);
    return res.redirect('/services');
  }
}
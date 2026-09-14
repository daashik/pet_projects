import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PaginationDto } from '../common/utils/pagination.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination?: PaginationDto) {
    const skip = pagination?.skip !== undefined ? Number(pagination.skip) : 0;
    const take = pagination?.take !== undefined ? Number(pagination.take) : 50;

    const [data, total] = await Promise.all([
      this.prisma.service.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.service.count(),
    ]);

    return { data, total };
  }

  async findOne(id: number) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException(`Услуга с ID ${id} не найдена`);
    }

    return service;
  }

  async create(body: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        title: body.title,
        description: body.description ?? null,
        priceRub: body.priceRub ? Number(body.priceRub) : null,
      },
    });
  }

  async update(id: number, body: UpdateServiceDto) {
    try {
      return await this.prisma.service.update({
        where: { id },
        data: {
          ...body,
          priceRub: body.priceRub ? Number(body.priceRub) : undefined,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Не удалось обновить: услуга с ID ${id} не найдена`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.service.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Не удалось удалить: услуга с ID ${id} не найдена`);
    }
  }
}
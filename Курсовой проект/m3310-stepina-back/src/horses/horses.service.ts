import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHorseDto } from './dto/create-horse.dto';
import { UpdateHorseDto } from './dto/update-horse.dto';
import { PaginationDto } from '../common/utils/pagination.dto';

@Injectable()
export class HorsesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination: PaginationDto) {
      const { skip, take } = pagination;

      const [data, total] = await Promise.all([
        this.prisma.horse.findMany({
          skip: Number(skip),
          take: Number(take),
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.horse.count(),
      ]);

      return { data, total };
    }

  async findOne(id: number) {
    const horse = await this.prisma.horse.findUnique({
      where: { id },
    });

    if (!horse) {
      throw new NotFoundException(`Лошадь с ID ${id} не найдена`);
    }

    return horse;
  }

  async findBookingsByHorseId(horseId: number) {
    return this.prisma.booking.findMany({
      where: { horseId },
    });
  }

  async create(body: CreateHorseDto) {
    return this.prisma.horse.create({
      data: { ...body },
    });
  }

  async update(id: number, body: UpdateHorseDto) {
    try {
      return await this.prisma.horse.update({
        where: { id },
        data: { ...body },
      });
    } catch (error) {
      throw new NotFoundException(`Не удалось обновить: лошадь с ID ${id} не найдена`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.horse.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Не удалось удалить: лошадь с ID ${id} не найдена`);
    }
  }
}
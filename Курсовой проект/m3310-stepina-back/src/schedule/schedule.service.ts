import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PaginationDto } from '../common/utils/pagination.dto';

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination?: PaginationDto) {
    const skip = pagination?.skip !== undefined ? Number(pagination.skip) : 0;
    const take = pagination?.take !== undefined ? Number(pagination.take) : 50;

    const [data, total] = await Promise.all([
      this.prisma.scheduleSlot.findMany({
        skip,
        take,
        orderBy: { startAt: 'asc' },
      }),
      this.prisma.scheduleSlot.count(),
    ]);

    return { data, total };
  }

  async findOne(id: number) {
    const slot = await this.prisma.scheduleSlot.findUnique({
      where: { id },
    });

    if (!slot) {
      throw new NotFoundException(`Запись расписания с ID ${id} не найдена`);
    }

    return slot;
  }

  async create(body: CreateScheduleDto) {
    return this.prisma.scheduleSlot.create({
      data: {
        ...body,
        startAt: new Date(body.startAt),
        endAt: new Date(body.endAt),
      },
    });
  }

  async update(id: number, body: UpdateScheduleDto) {
    try {
      return await this.prisma.scheduleSlot.update({
        where: { id },
        data: {
          ...body,
          startAt: body.startAt ? new Date(body.startAt) : undefined,
          endAt: body.endAt ? new Date(body.endAt) : undefined,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Не удалось обновить: запись с ID ${id} не найдена`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.scheduleSlot.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Не удалось удалить: запись с ID ${id} не найдена`);
    }
  }
}
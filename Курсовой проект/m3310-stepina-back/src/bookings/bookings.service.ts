import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { setPaginationHeader } from '../common/utils/pagination.header';
import { PaginationDto } from '../common/utils/pagination.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination: PaginationDto) {
    const { skip, take } = pagination;
    
    const [data, total] = await Promise.all([
      this.prisma.booking.findMany({
        skip: skip ? Number(skip) : 0,
        take: take ? Number(take) : 10,
        include: { user: true, service: true, horse: true, slot: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.booking.count(),
    ]);

    return { data, total };
  }

  async findOne(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { user: true, service: true, horse: true, slot: true },
    });
    if (!booking) throw new NotFoundException(`Бронирование #${id} не найдено`);
    return booking;
  }

  async create(body: CreateBookingDto) {
    return this.prisma.booking.create({
      data: {
        date: new Date(body.date),
        userId: Number(body.userId),
        serviceId: Number(body.serviceId),
        horseId: body.horseId ? Number(body.horseId) : null,
        slotId: body.slotId ? Number(body.slotId) : null,
        status: BookingStatus.NEW,
      },
    });
  }

  async update(id: number, body: UpdateBookingDto) {
    await this.findOne(id);
    return this.prisma.booking.update({
      where: { id },
      data: {
        date: body.date ? new Date(body.date) : undefined,
        userId: body.userId ? Number(body.userId) : undefined,
        serviceId: body.serviceId ? Number(body.serviceId) : undefined,
        horseId: body.horseId !== undefined ? (body.horseId ? Number(body.horseId) : null) : undefined,
        slotId: body.slotId !== undefined ? (body.slotId ? Number(body.slotId) : null) : undefined,
        status: body.status,
      },
    });
  }

  async updateStatus(id: number, status: BookingStatus) {
    return this.prisma.booking.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.booking.delete({ where: { id } });
  }
}
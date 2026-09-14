import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/utils/pagination.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination?: PaginationDto) {
    const skip = pagination?.skip !== undefined ? Number(pagination.skip) : 0;
    const take = pagination?.take !== undefined ? Number(pagination.take) : 50;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        include: {
          bookings: true,
          reviews: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return { data, total };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        bookings: true,
        reviews: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    return user;
  }

  async create(body: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
      },
    });
  }

  async update(id: number, body: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: { ...body },
      });
    } catch (error) {
      throw new NotFoundException(`Не удалось обновить: пользователь с ID ${id} не найден`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Не удалось удалить: пользователь с ID ${id} не найден`);
    }
  }
}
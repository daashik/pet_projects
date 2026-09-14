import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { PaginationDto } from '../common/utils/pagination.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination?: PaginationDto) {
    const skip = pagination?.skip !== undefined ? Number(pagination.skip) : 0;
    const take = pagination?.take !== undefined ? Number(pagination.take) : 50;

    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count(),
    ]);

    return { data, total };
  }

  async create(body: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        comment: body.comment,
        userId: typeof body.userId === 'number' ? body.userId : null,
      },
    });
  }

  async remove(id: number) {
    try {
      return await this.prisma.review.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Не удалось удалить: отзыв с ID ${id} не найден`);
    }
  }
}
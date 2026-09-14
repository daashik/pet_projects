import { Body, Controller, Get, Param, Post, Res, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Response } from 'express';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@ApiExcludeController()
@Controller('blog')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async getBlogPage(@Res() res: Response) {
    try {
      const { data } = await this.reviewsService.findAll({ skip: 0, take: 50 });
      return res.render('pages/blog', { reviews: data });
    } catch {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Ошибка загрузки страницы');
    }
  }

  @Post('reviews')
  async create(@Body() body: CreateReviewDto, @Res() res: Response) {
    await this.reviewsService.create(body);
    return res.redirect('/blog');
  }

  @Post('reviews/:id/delete')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.reviewsService.remove(id);
    return res.redirect('/blog');
  }
}
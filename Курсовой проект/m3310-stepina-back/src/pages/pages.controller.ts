import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ReviewsService } from '../reviews/reviews.service';
import { HorsesService } from '../horses/horses.service';
import { ServicesService } from '../services/services.service';
import { ScheduleService } from '../schedule/schedule.service';
import { BookingsService } from '../bookings/bookings.service';
import { UsersService } from '../users/users.service';
import { CreateReviewDto } from '../reviews/dto/create-review.dto';
import { PublicAccess } from '../auth/public-access.decorator';
import Session from 'supertokens-node/recipe/session';
import supertokens from 'supertokens-node';

@ApiExcludeController()
@Controller()
@PublicAccess()
export class PagesController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly horsesService: HorsesService,
    private readonly servicesService: ServicesService,
    private readonly scheduleService: ScheduleService,
    private readonly bookingsService: BookingsService,
    private readonly usersService: UsersService,
  ) {}

  private async buildSession(req: Request, res: Response) {
    try {
      const session = await Session.getSession(
        req as any,
        res as any,
        { sessionRequired: false },
      );
      if (session) {
        const userId = session.getUserId();
        const userInfo = await supertokens.getUser(userId);
        const email = userInfo?.emails?.[0] ?? userId;
        return { isAuth: true, user: { name: email, role: 'User' } };
      }
    } catch (e) {}
    return { isAuth: false, user: null };
  }

  @Get('/')
  @Render('pages/index')
  async home(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sessionData = await this.buildSession(req, res);
    try {
      const { data: slots } = await this.scheduleService.findAll({});
      return { ...sessionData, slots };
    } catch {
      return { ...sessionData, slots: [] };
    }
  }

  @Get('/prices')
  @Render('pages/prices')
  async prices(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.buildSession(req, res);
  }

  @Get('/blog')
  @Render('pages/blog')
  async blog(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const reviews = await this.reviewsService.findAll();
    return { ...(await this.buildSession(req, res)), reviews };
  }

  @Get('/horses')
  @Render('pages/horses')
  async horsesPage(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { data: horses } = await this.horsesService.findAll({});
    return { ...(await this.buildSession(req, res)), horses };
  }

  @Get('/services')
  @Render('pages/services')
  async servicesPage(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const services = await this.servicesService.findAll({});
    return { ...(await this.buildSession(req, res)), services };
  }

  @Get('/users')
  @Render('pages/users')
  async usersPage(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      const { data: users } = await this.usersService.findAll({ take: 10 });
      return { ...(await this.buildSession(req, res)), users };
    } catch {
      return { ...(await this.buildSession(req, res)), users: [], error: 'База занята' };
    }
  }

  @Get('/login')
  @Render('pages/login')
  async loginPage(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.buildSession(req, res);
  }

  @Get('/register')
  @Render('pages/register')
  async registerPage(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.buildSession(req, res);
  }

  @Post('/reviews')
  async createReview(@Body() createReviewDto: CreateReviewDto, @Res() res: Response) {
    await this.reviewsService.create(createReviewDto);
    return res.redirect('/blog');
  }

  //

  @Post('/auth/signout-redirect')
  @PublicAccess()
  async signout(@Res() res: Response) {
    return res.redirect('/');
  }
}
// import { Body, Controller, Get, Post, Query, Render, Res, Req } from '@nestjs/common';
// import { ReviewsService } from './reviews/reviews.service';
// import { CreateReviewDto } from './reviews/dto/create-review.dto';

// import { PublicAccess } from './auth/public-access.decorator';
// import Session from 'supertokens-node/recipe/session';

// @Controller()
// export class AppController {
//   constructor(private readonly reviewsService: ReviewsService) {}

//   private async buildSession(req: Request) {
//     try {
//       const session = await Session.getSession(req as any, {} as any, { sessionRequired: false });
//       if (session) {
//         const userId = session.getUserId();
//         return {
//           isAuth: true,
//           user: { name: userId, role: 'User' },
//         };
//       }
//     } catch {
//     }
//     return { isAuth: false, user: null };
//   }

//   @Get('/')
//   @PublicAccess()
//   @Render('index')
//   async index(@Req() req: Request) {
//     return this.buildSession(req);
//   }

//   @Get('/prices')
//   @PublicAccess()
//   @Render('prices')
//   async prices(@Req() req: Request) {
//     return this.buildSession(req);
//   }

//   @Get('/blog')
//   @Render('blog')
//   async blog(@Req() req: Request) {
//     const reviews = await this.reviewsService.findAll();

//     return {
//       ...await this.buildSession(req),
//       reviews,
//     };
//   }

//   @Post('/reviews')
//   async createReview(@Body() createReviewDto: CreateReviewDto, @Res() res) {
//     await this.reviewsService.create(createReviewDto);
//     return res.redirect('/blog');
//   }
// }
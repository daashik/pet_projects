import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { Review } from './models/review.model';
import { CreateReviewInput } from './dto/create-review.input';
import { User } from '../users/models/user.model';
import { PrismaService } from '../prisma/prisma.service';

@Resolver(() => Review)
export class ReviewsResolver {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly prisma: PrismaService,
  ) {}

  @Query(() => [Review], { name: 'reviews' })
  async findAll(
    @Args('skip', { type: () => Int, defaultValue: 0, nullable: true }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 50, nullable: true }) take: number,
  ) {
    const { data } = await this.reviewsService.findAll({ skip, take });
    return data;
  }

  @Query(() => Review, { name: 'review', nullable: true })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.prisma.review.findUnique({
      where: { id },
    });
  }

  @Mutation(() => Review)
  async createReview(@Args('createReviewInput') createReviewInput: CreateReviewInput) {
    return this.reviewsService.create(createReviewInput);
  }

  @Mutation(() => Review)
  async removeReview(@Args('id', { type: () => Int }) id: number) {

    return this.reviewsService.remove(id); 
  }

  @ResolveField(() => User, { nullable: true })
  async user(@Parent() review: Review) {
    if (!review.userId) {
      return null;
    }

    return this.prisma.user.findUnique({
      where: { id: review.userId },
    });
  }
}
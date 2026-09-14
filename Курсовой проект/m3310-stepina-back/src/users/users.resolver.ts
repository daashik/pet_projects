import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Booking } from '../bookings/models/booking.model';
import { PrismaService } from '../prisma/prisma.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  @Query(() => [User], { name: 'users' })
  async findAll(
    @Args('skip', { type: () => Int, defaultValue: 0, nullable: true }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 50, nullable: true }) take: number,
  ) {
    const { data } = await this.usersService.findAll({ skip, take });
    return data;
  }

  @Query(() => User, { name: 'user' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Mutation(() => User)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    const { id, ...updateData } = updateUserInput;
    return this.usersService.update(id, updateData);
  }

  @Mutation(() => User)
  async removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }

  @ResolveField(() => [Booking], { nullable: true })
  async bookings(@Parent() user: User) {
    return this.prisma.booking.findMany({
      where: { userId: user.id },
    });
  }
}
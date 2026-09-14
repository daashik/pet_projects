import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { HorsesService } from './horses.service';
import { Horse } from './models/horses.model';
import { CreateHorseInput } from './dto/create-horse.input';
import { UpdateHorseInput } from './dto/update-horse.input';
import { Booking } from '../bookings/models/booking.model';
import { PrismaService } from '../prisma/prisma.service';

@Resolver(() => Horse)
export class HorsesResolver {
  constructor(
    private readonly horsesService: HorsesService,
    private readonly prisma: PrismaService,
  ) {}

  @Query(() => [Horse], { name: 'horses' })
  async findAll(
    @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10 }) take: number,
  ) {
    const result = await this.horsesService.findAll({ skip, take });
    return result.data; 
  }

  @Query(() => Horse, { name: 'horse' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.horsesService.findOne(id);
  }

  @Mutation(() => Horse)
  async createHorse(@Args('createHorseInput') createHorseInput: CreateHorseInput) {
    return this.horsesService.create(createHorseInput);
  }

  @Mutation(() => Horse)
  async updateHorse(@Args('updateHorseInput') updateHorseInput: UpdateHorseInput) {
    const { id, ...updateData } = updateHorseInput;
    return this.horsesService.update(id, updateData);
  }

  @Mutation(() => Horse)
  async removeHorse(@Args('id', { type: () => Int }) id: number) {
    return this.horsesService.remove(id);
  }


  @ResolveField(() => [Booking], { nullable: true })
    async bookings(@Parent() horse: Horse) {
      return this.prisma.booking.findMany({
        where: { horseId: horse.id },
      });
   }
}
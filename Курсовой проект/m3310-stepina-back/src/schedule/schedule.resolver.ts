import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ScheduleService } from './schedule.service';
import { ScheduleSlot } from './models/schedule.model';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { UpdateScheduleInput } from './dto/update-schedule.input';
import { Booking } from '../bookings/models/booking.model';
import { PrismaService } from '../prisma/prisma.service';

@Resolver(() => ScheduleSlot)
export class ScheduleResolver {
  constructor(
    private readonly scheduleService: ScheduleService, 
    private readonly prisma: PrismaService,
  ) {}

  @Query(() => [ScheduleSlot], { name: 'scheduleSlots' })
  async findAll(
    @Args('skip', { type: () => Int, defaultValue: 0, nullable: true }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 50, nullable: true }) take: number,
  ) {
    const { data } = await this.scheduleService.findAll({ skip, take });
    return data;
  }

  @Query(() => ScheduleSlot, { name: 'scheduleSlot' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.scheduleService.findOne(id);
  }

  @Mutation(() => ScheduleSlot)
  async createScheduleSlot(@Args('createScheduleInput') createScheduleInput: CreateScheduleInput) {
    return this.scheduleService.create(createScheduleInput);
  }

  @Mutation(() => ScheduleSlot)
  async updateScheduleSlot(@Args('updateScheduleInput') updateScheduleInput: UpdateScheduleInput) {
    const { id, ...updateData } = updateScheduleInput;
    return this.scheduleService.update(id, updateData);
  }

  @Mutation(() => ScheduleSlot)
  async removeScheduleSlot(@Args('id', { type: () => Int }) id: number) {
    return this.scheduleService.remove(id);
  }

  @ResolveField(() => [Booking], { nullable: true })
  async bookings(@Parent() slot: ScheduleSlot) {
    return this.prisma.booking.findMany({
      where: { slotId: slot.id },
    });
  }
}
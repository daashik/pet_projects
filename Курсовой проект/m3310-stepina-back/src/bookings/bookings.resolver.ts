import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { BookingsService } from './bookings.service';
import { Booking } from './models/booking.model';
import { CreateBookingInput } from './dto/create-booking.input';
import { UpdateBookingInput } from './dto/update-booking.input';
import { BookingStatus } from '@prisma/client';
import { Horse } from '../horses/models/horses.model';
import { User } from '../users/models/user.model';
import { Service } from '../services/models/service.model';
import { PrismaService } from '../prisma/prisma.service';


@Resolver(() => Booking)
export class BookingsResolver {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly prisma: PrismaService,
  ) {}

  @Query(() => [Booking], { name: 'bookings' })
  async findAll(
    @Args('skip', { type: () => Int, defaultValue: 0, nullable: true }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 10, nullable: true }) take: number,
  ) {
    const { data } = await this.bookingsService.findAll({ skip, take });
    return data;
  }

  @Query(() => Booking, { name: 'booking' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.bookingsService.findOne(id);
  }

  @Mutation(() => Booking)
  async createBooking(@Args('createBookingInput') createBookingInput: CreateBookingInput) {
    return this.bookingsService.create(createBookingInput);
  }

  @Mutation(() => Booking)
  async updateBooking(@Args('updateBookingInput') updateBookingInput: UpdateBookingInput) {
    const { id, ...updateData } = updateBookingInput;
    return this.bookingsService.update(id, updateData);
  }

  @Mutation(() => Booking)
  async removeBooking(@Args('id', { type: () => Int }) id: number) {
    return this.bookingsService.remove(id);
  }
  
  @Mutation(() => Booking, { description: 'Подтвердить бронирование' })
  async confirmBooking(@Args('id', { type: () => Int }) id: number) {
    return this.bookingsService.updateStatus(id, BookingStatus.CONFIRMED);
  }

  @Mutation(() => Booking, { description: 'Отменить бронирование' })
  async cancelBooking(@Args('id', { type: () => Int }) id: number) {
    return this.bookingsService.updateStatus(id, BookingStatus.CANCELED);
  }

  @Mutation(() => Booking, { description: 'Завершить бронирование' })
  async completeBooking(@Args('id', { type: () => Int }) id: number) {
    return this.bookingsService.updateStatus(id, BookingStatus.COMPLETED);
  }

  @ResolveField(() => Horse, { nullable: true })
  async horse(@Parent() booking: Booking) {
    if (!booking.horseId) return null;
    return this.prisma.horse.findUnique({
      where: { id: booking.horseId },
    });
  }

  @ResolveField(() => User, { nullable: true })
  async user(@Parent() booking: Booking) {
    return this.prisma.user.findUnique({
      where: { id: booking.userId },
    });
  }

  @ResolveField(() => Service, { nullable: true })
  async service(@Parent() booking: Booking) {
    return this.prisma.service.findUnique({
      where: { id: booking.serviceId },
    });
  }
}
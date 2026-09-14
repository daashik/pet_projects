import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ServicesService } from './services.service';
import { Service } from './models/service.model';
import { CreateServiceInput } from './dto/create-service.input';
import { UpdateServiceInput } from './dto/update-service.input';
import { Booking } from '../bookings/models/booking.model';
import { PrismaService } from '../prisma/prisma.service';

@Resolver(() => Service)
export class ServicesResolver {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly prisma: PrismaService, 
  ) {}

  @Query(() => [Service], { name: 'services' })
  async findAll(
    @Args('skip', { type: () => Int, defaultValue: 0, nullable: true }) skip: number,
    @Args('take', { type: () => Int, defaultValue: 50, nullable: true }) take: number,
  ) {
    const { data } = await this.servicesService.findAll({ skip, take });
    return data;
  }

  @Query(() => Service, { name: 'service' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.servicesService.findOne(id);
  }

  @Mutation(() => Service)
  async createService(@Args('createServiceInput') createServiceInput: CreateServiceInput) {
    return this.servicesService.create(createServiceInput);
  }

  @Mutation(() => Service)
  async updateService(@Args('updateServiceInput') updateServiceInput: UpdateServiceInput) {
    const { id, ...updateData } = updateServiceInput;
    return this.servicesService.update(id, updateData);
  }

  @Mutation(() => Service)
  async removeService(@Args('id', { type: () => Int }) id: number) {
    return this.servicesService.remove(id);
  }

  @ResolveField(() => [Booking], { nullable: true })
  async bookings(@Parent() service: Service) {
    return this.prisma.booking.findMany({
      where: { serviceId: service.id },
    });
  }
}
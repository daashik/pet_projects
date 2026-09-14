import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersApiController } from './users.api.controller';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController, UsersApiController],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
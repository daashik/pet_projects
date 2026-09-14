import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { fieldExtensionsEstimator, getComplexity, simpleEstimator } from 'graphql-query-complexity';
import { CacheModule } from '@nestjs/cache-manager';

import { PrismaModule } from './prisma/prisma.module';
import { ServicesModule } from './services/services.module';
import { HorsesModule } from './horses/horses.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';
import { ScheduleModule } from './schedule/schedule.module';
import { PagesModule } from './pages/pages.module';
import { EventsModule } from './events/events.module';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule.forRoot({
      connectionUri: process.env.SUPERTOKENS_CONNECTION_URI!,
      apiKey: process.env.SUPERTOKENS_API_KEY!,
      appName: process.env.APP_NAME ?? 'Dust & Glory',
      websiteDomain: process.env.WEBSITE_DOMAIN ?? 'http://localhost:3001',
      apiDomain: process.env.API_DOMAIN ?? 'http://localhost:3001',
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 15,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: false, // Схема не грузилась! - true
      playground: true,
      introspection: true,
      plugins: [
        {
          async requestDidStart() {
            return {
              async didResolveOperation({ request, document, schema }) {
                const isIntrospection = 
                  request.operationName === 'IntrospectionQuery' || 
                  request.query?.includes('__schema');

                if (isIntrospection) {
                  return; // Схема не грузилась!
                }

                const complexity = getComplexity({
                  schema,
                  operationName: request.operationName,
                  query: document,
                  variables: request.variables,
                  estimators: [
                    fieldExtensionsEstimator(),
                    simpleEstimator({ defaultComplexity: 1 }),
                  ],
                });

                // 20
                if (complexity > 50) { 
                  throw new Error(
                    `Запрос слишком сложный: ${complexity}. Максимально допустимая сложность: 50`,
                  );
                }
                
                console.log('Сложность запроса:', complexity);
              },
            };
          },
        },
      ],
    }),
    PrismaModule,
    ServicesModule,
    HorsesModule,
    BookingsModule,
    ReviewsModule,
    UsersModule,
    ScheduleModule,
    PagesModule,
    EventsModule,
  ],
  controllers: [],
})
export class AppModule {}
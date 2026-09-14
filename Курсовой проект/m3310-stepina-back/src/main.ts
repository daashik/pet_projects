import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';
import 'reflect-metadata';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './common/prisma-exception.filter';
import { TimingInterceptor } from './common/interceptors/timing.interceptor';
import supertokens from 'supertokens-node';
import { middleware } from 'supertokens-node/framework/express';

import cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: process.env.WEBSITE_DOMAIN ?? 'http://localhost:3001',
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  app.use(cookieParser());
  app.use(middleware());

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalInterceptors(new TimingInterceptor());

  app.useStaticAssets(join(process.cwd(), 'public'));
  app.setBaseViewsDir(join(process.cwd(), 'views'));
  app.setViewEngine('hbs');

  const hbsLib = require('hbs');
  const hbs = hbsLib?.default ?? hbsLib;
  hbs.registerPartials(join(process.cwd(), 'views', 'partials'));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Dust & Glory API')
    .setDescription('REST API для конного клуба Dust & Glory')
    .setVersion('1.0')
    .addTag('Horses (API)')
    .addTag('Bookings (API)')
    .addTag('Reviews (API)')
    .addTag('Users (API)')
    .addTag('Schedule (API)')
    .addTag('Services (API)')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },'bearer')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port, '0.0.0.0');
  
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger documentation: http://localhost:${port}/api/docs`);
  logger.log(`GraphQL: http://localhost:${port}/graphql`);
}

bootstrap();

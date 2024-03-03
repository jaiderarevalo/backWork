import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { HttpStatus, ValidationError, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('dev'));
  app.setGlobalPrefix('/app');
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const response = {
          statusCode: HttpStatus.BAD_REQUEST,
          message: {},
          error: HttpStatus[HttpStatus.BAD_REQUEST],
        };
        errors.forEach((error) => {
          const field = error.property;
          const constraints = Object.values(error.constraints);
          response.message[field] = constraints;
        });
        return response;
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();

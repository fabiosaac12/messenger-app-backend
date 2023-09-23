import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionFilter } from '@app/common/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(`${process.env.ENVIRONMENT}/api/v1`);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new AllExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Project X - API')
    .setDescription('API documentation for Project X backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(
    `${process.env.ENVIRONMENT}/api/docs`,
    app,
    swaggerDocument,
    {
      swaggerOptions: { filter: true },
    },
  );

  await app.listen(process.env.PORT);

  Logger.log(`API Gateway running on port ${process.env.PORT}`);
  Logger.debug(
    `Open documentation: ${process.env.BASE_URL}/${process.env.ENVIRONMENT}/api/docs`,
  );
}

bootstrap();

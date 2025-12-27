import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { UnifiedErrorFilter } from './shared/infrastructure/common/filters/unified-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Standardize Error Responses
  app.useGlobalFilters(new UnifiedErrorFilter());

  // Automatic Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Agencia Em1 Click API')
    .setDescription('The Agencia Em1 Click API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000/api/v1`);
  console.log(
    `Swagger documentation available at: http://localhost:3000/api/v1/docs`,
  );
}
bootstrap();

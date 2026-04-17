import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://agencia.amorimdev.cloud',
      'https://agencia.amorimdev.cloud',
      'http://vitrine.amorimdev.cloud',
      'https://vitrine.amorimdev.cloud',
      'http://store.amorimdev.cloud',
      'https://store.amorimdev.cloud',
      'https://api.amorimdev.cloud',
      'https://idreau.com.br',
      'http://idreau.com.br',
      'https://em1.click',
      'https://vitrine.em1.click',
      'https://qrcode.amorimdev.cloud',
      'https://xqbx.co',
      'http://xqbx.co',
      /http:\/\/localhost:\d+$/,
      /https:\/\/localhost:\d+$/,
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Middleware for PNA (Private Network Access)
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Private-Network', 'true');
    next();
  });
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Bureau API')
    .setDescription('The Bureau backend API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  Logger.log(`Application is running on: http://localhost:${port}`);
  Logger.log(`Swagger is running on: http://localhost:${port}/api`);
}
bootstrap();

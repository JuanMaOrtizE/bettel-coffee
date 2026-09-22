import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Bettel Coffee API')
    .setDescription('API para la operación de Bettel Coffee')
    .setVersion('1.0')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, documentFactory, {
    customSiteTitle: 'Bettel Coffee API Docs',
  });

  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();

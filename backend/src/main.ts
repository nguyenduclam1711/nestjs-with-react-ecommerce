import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionsFilter } from './common/filters/http-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup swagger
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Nestjs with react ecommerce')
    .setDescription('The Nestjs with react ecommerce API description')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Use global filter
  app.useGlobalFilters(new HttpExceptionsFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(/* {
    origin: 'http://localhost:3001',
  } */);
  const config = new DocumentBuilder()
    .setTitle('Contacts Managment')
    .setDescription('Manage all your contacts')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true }),
    new ValidationPipe({
      transform: true,
      transformOptions: { groups: ['transform'] },
    }),
  );
  await app.listen(3000);
}
bootstrap();

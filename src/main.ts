import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Ovoz Berish Tizimi')
    .setDescription('Ovoz berish tizimi API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log('Server http://localhost:3000');
  console.log('Swagger: http://localhost:3000/api');
  console.log('GraphQL: http://localhost:3000/graphql');
  console.log('WebSocket: ws://localhost:3000');
}
bootstrap();
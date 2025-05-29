import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si se envían propiedades no permitidas
      transform: true, // Convierte automáticamente payloads a instancias de clase
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API Tienda de Conveniencia')
    .setDescription(
      'Documentación de la API para gestión de productos, ventas y más',
    )
    .setVersion('1.0')
    .addBearerAuth() // Si usas JWT, si no puedes quitarlo
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // http://localhost:3000/api

  await app.listen(3003);
}
bootstrap();

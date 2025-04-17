import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { PrismaModule } from 'src/prisma/prisma.module';


// Hola
@Module({
  providers: [ProductosService],
  controllers: [ProductosController],
  imports: [PrismaModule],
})
export class ProductosModule {}

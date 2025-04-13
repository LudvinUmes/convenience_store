import { Module } from '@nestjs/common';
import { tipos_productoService } from './tipos_producto.service';
import { Tipos_productoController } from './tipos_producto.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [tipos_productoService],
  controllers: [Tipos_productoController],
  imports: [PrismaModule],
})
export class Tipos_productoModule {}

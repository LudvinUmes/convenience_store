import { Module } from '@nestjs/common';
import { VentasController } from './ventas.controller';
import { VentasService } from './ventas.service';
import { PrismaModule } from 'src/prisma/prisma.module';

/**
 * Módulo principal de ventas.
 * Este módulo organiza todo lo relacionado con las ventas de la tienda.
 *
 * Se integra con el módulo de Prisma para acceder a la base de datos.
 */
@Module({
  controllers: [VentasController],
  providers: [VentasService],
  imports: [PrismaModule],
  exports: [VentasService],
})
export class VentasModule {}

import { Module } from '@nestjs/common';
import { DevolucionesController } from './devoluciones.controller';
import { DevolucionesService } from './devoluciones.service';
import { PrismaModule } from 'src/prisma/prisma.module';

/**
 * Módulo principal de devoluciones.
 * Este módulo organiza todo lo relacionado con las devoluciones de productos en la tienda.
 *
 * Se integra con el módulo de Prisma para acceder a la base de datos.
 */
@Module({
  controllers: [DevolucionesController],
  providers: [DevolucionesService],
  imports: [PrismaModule],
  exports: [DevolucionesService],
})
export class DevolucionesModule {}

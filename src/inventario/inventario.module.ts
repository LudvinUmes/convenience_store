import { Module } from '@nestjs/common';
import { InventarioController } from './inventario.controller';
import { InventarioService } from './inventario.service';
import { PrismaModule } from 'src/prisma/prisma.module';

/**
 * Módulo principal de inventario.
 * Este módulo organiza todo lo relacionado con la gestión de inventario,
 * productos, materias primas y reportes de la tienda.
 * 
 * Se integra con el módulo de Prisma para acceder a la base de datos.
 */
@Module({
  controllers: [InventarioController],
  providers: [InventarioService],
  imports: [PrismaModule],
  exports: [InventarioService]
})
export class InventarioModule {}
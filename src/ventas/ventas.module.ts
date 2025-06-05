import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { PrismaService } from 'src/prisma/prisma.service';

/**
 * Módulo principal de ventas.
 * Este módulo organiza todo lo relacionado con las ventas de la tienda.
 *
 * Se integra con el módulo de Prisma para acceder a la base de datos.
 */
@Module({
  imports: [
    HttpModule.register({
      // Ajusta esta URL base al host de tu API de pagos:
      baseURL:
        process.env.PAGOS_API_BASE_URL || 'https://api.tu-dominio.com/pagos',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  ],
  controllers: [VentasController],
  providers: [VentasService, PrismaService],
})
export class VentasModule {}

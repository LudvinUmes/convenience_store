import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductosModule } from './productos/productos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { MarcasModule } from './marcas/marcas.module';
import { Lote_productosModule } from './lotes/lotes.module';
import { VentasModule } from './ventas/ventas.module';
import { DevolucionesModule } from './devoluciones/devoluciones.module';

@Module({
  imports: [
    PrismaModule,
    ProductosModule,
    CategoriasModule,
    MarcasModule,
    Lote_productosModule,
    VentasModule,
    DevolucionesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductosModule } from './productos/productos.module';
import { Tipos_productoModule } from './tipos_producto/tipos_producto.module';
import { MarcasModule } from './marcas/marcas.module';
import { Lote_productosModule } from './lotes/lotes.module';
import { RecetasModule } from './recetas/recetas.module';
import { VentasModule } from './ventas/ventas.module';
import { DevolucionesModule } from './devoluciones/devoluciones.module';

@Module({
  imports: [
    PrismaModule,
    ProductosModule,
    Tipos_productoModule,
    MarcasModule,
    Lote_productosModule,
    RecetasModule,
    VentasModule,
    DevolucionesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

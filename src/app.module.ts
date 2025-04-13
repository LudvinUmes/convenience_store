import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';

// Módulos del sistema
import { ProductosModule } from './productos/productos.module';
import { Tipos_productoModule } from './tipos_producto/tipos_producto.module';
import { MarcasModule } from './marcas/marcas.module';
import { Lote_productosModule } from './lotes/lotes.module';
import { RecetasModule } from './recetas/recetas.module';

@Module({
  imports: [
    PrismaModule,
    ProductosModule,
    Tipos_productoModule,
    MarcasModule,
    Lote_productosModule,
    RecetasModule,
  ],
})
export class AppModule {}

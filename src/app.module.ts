import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductosModule } from './productos/productos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { MarcasModule } from './marcas/marcas.module';
import { VentasModule } from './ventas/ventas.module';
import { RecetasModule } from './recetas/recetas.module';
import { LotesModule } from './lotes/lotes.module';

@Module({
  imports: [
    PrismaModule,
    ProductosModule,
    CategoriasModule,
    MarcasModule,
    LotesModule,
    VentasModule,
    RecetasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

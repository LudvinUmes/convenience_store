import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductosModule } from './productos/productos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { MarcasModule } from './marcas/marcas.module';
import { Lote_productosModule } from './lotes/lotes.module';
import { RecetasModule } from './recetas/recetas.module';
import { VentasModule } from './ventas/ventas.module';
import { DevolucionesModule } from './devoluciones/devoluciones.module';
import {MateriasPrimaModule} from './materias_primas/materia_prima.module';
import { AsignacionRecetaModule } from './asignacion_recetas/asignacion_receta.module';

@Module({
  imports: [
    PrismaModule,
    ProductosModule,
    CategoriasModule,
    MarcasModule,
    Lote_productosModule,
    RecetasModule,
    VentasModule,
    DevolucionesModule,
    MateriasPrimaModule,
    AsignacionRecetaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

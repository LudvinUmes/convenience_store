import { Module } from '@nestjs/common';
import { ProductosModule } from './productos/productos.module';
import { VentasModule } from './ventas/ventas.module';
import { DevolucionesModule } from './devoluciones/devoluciones.module';
import { InventarioModule } from './inventario/inventario.module';
import { InventarioModule } from './inventario/inventario.module';

@Module({
  imports: [ProductosModule, VentasModule, DevolucionesModule, InventarioModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

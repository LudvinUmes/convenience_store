import { Module } from '@nestjs/common';
import { ProductosModule } from './productos/productos.module';
import { VentasModule } from './ventas/ventas.module';
import { DevolucionesModule } from './devoluciones/devoluciones.module';

@Module({
  imports: [ProductosModule, VentasModule, DevolucionesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

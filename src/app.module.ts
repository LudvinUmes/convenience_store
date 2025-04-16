import { Module } from '@nestjs/common';
import { ProductosModule } from './productos/productos.module';
import { VentasModule } from './ventas/ventas.module';

@Module({
  imports: [ProductosModule, VentasModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

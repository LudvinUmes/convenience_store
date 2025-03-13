import { Module } from '@nestjs/common';
import { ProductosModule } from './productos/productos.module';

@Module({
  imports: [ProductosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

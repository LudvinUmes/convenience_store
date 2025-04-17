import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { productos as Producto, Prisma } from '@prisma/client';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  async obtenerProductos(): Promise<Producto[]> {
    return await this.productosService.getAllProducts();
  }

  // Obtener Producto por ID
  @Get(':id')
  async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<Producto> {
    return await this.productosService.getById(id);
  }

  @Post()
  async crearProducto(
    @Body() productoData: Prisma.productosCreateInput,
  ): Promise<Producto> {
    return await this.productosService.createProduct(productoData);
  }

  @Put(':id')
  async actualizarProducto(
    @Param('id', ParseIntPipe) id: number,
    @Body() productoData: Prisma.productosUpdateInput,
  ): Promise<Producto> {
    return await this.productosService.updateProduct(id, productoData);
  }

  @Delete(':id')
  async eliminarProducto(@Param('id', ParseIntPipe) id: number): Promise<Producto> {
    return await this.productosService.deleteProduct(id);
  }
}

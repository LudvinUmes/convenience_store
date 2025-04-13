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

  // Obtener todos los productos
  @Get()
  async obtenerProductos(): Promise<Producto[]> {
    return await this.productosService.getAllProducts();
  }

  // Obtener un producto por su ID
  @Get(':id')
  async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<Producto> {
    return await this.productosService.getById(id);
  }

  // Crear un nuevo producto
  @Post()
  async crearProducto(
    @Body() productoData: Prisma.productosCreateInput,
  ): Promise<Producto> {
    return await this.productosService.createProduct(productoData);
  }

  // Actualizar un producto
  @Put(':id')
  async actualizarProducto(
    @Param('id', ParseIntPipe) id: number,
    @Body() productoData: Prisma.productosUpdateInput,
  ): Promise<Producto> {
    return await this.productosService.updateProduct(id, productoData);
  }

  // Eliminar un producto (borrado lógico)
  @Delete(':id')
  async eliminarProducto(@Param('id', ParseIntPipe) id: number): Promise<Producto> {
    return await this.productosService.deleteProduct(id);
  }
}

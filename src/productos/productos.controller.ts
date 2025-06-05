import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { productos as Producto } from '@prisma/client';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@ApiTags('Productos')
@Controller('')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @ApiQuery({ name: 'tipo', required: false, enum: ['FINAL', 'PREPARADO'] })
  @ApiQuery({ name: 'id_categoria', required: false, type: Number })
  @ApiQuery({ name: 'es_materia_prima', required: false, type: Boolean })
  @Get('GET/productos')
  async obtenerProductos(
    @Query('tipo') tipo?: 'FINAL' | 'PREPARADO',
    @Query('id_categoria') id_categoria?: number,
    @Query('es_materia_prima') es_materia_prima?: boolean,
  ): Promise<Producto[]> {
    return await this.productosService.getAllProducts({
      tipo,
      id_categoria: id_categoria ? Number(id_categoria) : undefined,
      es_materia_prima:
        es_materia_prima === undefined
          ? undefined
          : typeof es_materia_prima === 'boolean'
            ? es_materia_prima
            : es_materia_prima === 'true',
    });
  }

  @Get('GET/productos/:id')
  async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<Producto> {
    return await this.productosService.getById(id);
  }

  @Post('POST/productos')
  async crearProducto(
    @Body() productoData: CreateProductoDto,
  ): Promise<Producto> {
    return await this.productosService.createProduct(productoData);
  }

  @Put('PUT/productos/:id')
  async actualizarProducto(
    @Param('id', ParseIntPipe) id: number,
    @Body() productoData: UpdateProductoDto,
  ): Promise<Producto> {
    return await this.productosService.updateProduct(id, productoData);
  }

  @Delete('DELETE/productos/:id')
  async eliminarProducto(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Producto> {
    return await this.productosService.deleteProduct(id);
  }
}

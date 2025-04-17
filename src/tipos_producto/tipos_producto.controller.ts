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
  import { tipos_productoService } from './tipos_producto.service';
  import { tipos_producto as Tipos_producto, Prisma } from '@prisma/client';
  
  @Controller('tipos_producto')
  export class Tipos_productoController {
    constructor(private readonly tipos_productoService: tipos_productoService) {}
  
    @Get()
    async obtenerTodos(): Promise<Tipos_producto[]> {
      return await this.tipos_productoService.getAll();
    }
  
    @Get(':id')
    async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<Tipos_producto> {
      return await this.tipos_productoService.getById(id);
    }
  
    @Post()
    async crear(@Body() data: Prisma.tipos_productoCreateInput): Promise<Tipos_producto> {
      return await this.tipos_productoService.create(data);
    }
  
    @Put(':id')
    async actualizar(
      @Param('id', ParseIntPipe) id: number,
      @Body() data: Prisma.tipos_productoUpdateInput,
    ): Promise<Tipos_producto> {
      return await this.tipos_productoService.update(id, data);
    }
  
    @Delete(':id')
    async eliminar(@Param('id', ParseIntPipe) id: number): Promise<Tipos_producto> {
      return await this.tipos_productoService.delete(id);
    }
  }
  
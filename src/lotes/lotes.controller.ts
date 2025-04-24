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
  import { lote_productosService } from './lotes.service';
  import { lote_productos as Lote_productos, Prisma } from '@prisma/client';
  
  @Controller('lote_productos')
  export class Lote_productosController {
    constructor(private readonly lote_productosService: lote_productosService) {}
  
    @Get()
    async obtenerTodos(): Promise<Lote_productos[]> {
      return await this.lote_productosService.getAll();
    }
  
    @Get(':id')
    async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<Lote_productos> {
      return await this.lote_productosService.getById(id);
    }
  
    @Post()
    async crear(@Body() data: Prisma.lote_productosCreateInput): Promise<Lote_productos> {
      return await this.lote_productosService.create(data);
    }
  
    @Put(':id')
    async actualizar(
      @Param('id', ParseIntPipe) id: number,
      @Body() data: Prisma.lote_productosUpdateInput,
    ): Promise<Lote_productos> {
      return await this.lote_productosService.update(id, data);
    }
  
    @Delete(':id')
    async eliminar(@Param('id', ParseIntPipe) id: number): Promise<Lote_productos> {
      return await this.lote_productosService.delete(id);
    }
  }
  
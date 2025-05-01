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
  import { MateriaPrimaService } from './materia_prima.service';
  import { productos as Producto, Prisma } from '@prisma/client';
  
  @Controller('materia-prima')
  export class MateriaPrimaController {
    constructor(private readonly materiaPrimaService: MateriaPrimaService) {}
  
    @Get()
    async obtenerTodos(): Promise<Producto[]> {
      return await this.materiaPrimaService.findAll();
    }
  
    @Get('categoria/:id')
    async obtenerPorCategoria(@Param('id', ParseIntPipe) id: number): Promise<Producto[]> {
      return await this.materiaPrimaService.getByCategoria(id);
    }
  
    @Get('bajo-stock')
    async obtenerBajoStock(): Promise<Producto[]> {
      return await this.materiaPrimaService.getBajoStock();
    }
  
    @Get(':id')
    async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<Producto> {
      return await this.materiaPrimaService.findOne(id);
    }
  
    @Post()
    async crear(@Body() data: Prisma.productosUncheckedCreateInput): Promise<Producto> {
      return await this.materiaPrimaService.create(data);
    }
  
    @Put(':id')
    async actualizar(
      @Param('id', ParseIntPipe) id: number,
      @Body() data: Prisma.productosUncheckedUpdateInput,
    ): Promise<Producto> {
      return await this.materiaPrimaService.update(id, data);
    }
  
    @Delete(':id')
    async eliminar(@Param('id', ParseIntPipe) id: number): Promise<Producto> {
      return await this.materiaPrimaService.remove(id);
    }
  }
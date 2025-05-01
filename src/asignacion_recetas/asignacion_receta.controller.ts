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
  import { AsignacionRecetaService } from './asignacion_receta.service';
  import { asignacion_receta_materia_prima as AsignacionReceta, Prisma } from '@prisma/client';
  
  @Controller('asignacion-receta')
  export class AsignacionRecetaController {
    constructor(private readonly asignacionRecetaService: AsignacionRecetaService) {}
  
    @Get()
    async obtenerTodos(): Promise<AsignacionReceta[]> {
      return await this.asignacionRecetaService.findAll();
    }
  
    @Get('receta/:id')
    async obtenerPorReceta(@Param('id', ParseIntPipe) id: number): Promise<AsignacionReceta[]> {
      return await this.asignacionRecetaService.findByReceta(id);
    }
  
    @Get('materia-prima/:id')
    async obtenerPorMateriaPrima(@Param('id', ParseIntPipe) id: number): Promise<AsignacionReceta[]> {
      return await this.asignacionRecetaService.findByMateriaPrima(id);
    }
  
    @Get(':productoId/:recetaId')
    async obtenerPorIds(
      @Param('productoId', ParseIntPipe) productoId: number,
      @Param('recetaId', ParseIntPipe) recetaId: number,
    ): Promise<AsignacionReceta> {
      return await this.asignacionRecetaService.findOne(productoId, recetaId);
    }
  
    @Post()
    async crear(@Body() data: Prisma.asignacion_receta_materia_primaUncheckedCreateInput): Promise<AsignacionReceta> {
      return await this.asignacionRecetaService.create(data);
    }
  
    @Put(':productoId/:recetaId')
    async actualizar(
      @Param('productoId', ParseIntPipe) productoId: number,
      @Param('recetaId', ParseIntPipe) recetaId: number,
      @Body() data: Prisma.asignacion_receta_materia_primaUncheckedUpdateInput,
    ): Promise<AsignacionReceta> {
      return await this.asignacionRecetaService.update(productoId, recetaId, data);
    }
  
    @Delete(':productoId/:recetaId')
    async eliminar(
      @Param('productoId', ParseIntPipe) productoId: number,
      @Param('recetaId', ParseIntPipe) recetaId: number,
    ): Promise<AsignacionReceta> {
      return await this.asignacionRecetaService.remove(productoId, recetaId);
    }
  }
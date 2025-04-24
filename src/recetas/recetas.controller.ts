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
import { RecetasService } from './recetas.service';
import { recetas as Recetas, Prisma } from '@prisma/client';

@Controller('recetas')
export class RecetasController {
  constructor(private readonly recetasService: RecetasService) {}

  @Get()
  async obtenerTodos(): Promise<Recetas[]> {
    return await this.recetasService.getAll();
  }

  @Get(':id')
  async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<Recetas> {
    return await this.recetasService.getById(id);
  }

  @Post()
  async crear(@Body() data: Prisma.recetasCreateInput): Promise<Recetas> {
    return await this.recetasService.create(data);
  }

  @Put(':id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.recetasUpdateInput,
  ): Promise<Recetas> {
    return await this.recetasService.update(id, data);
  }

  @Delete(':id')
  async eliminar(@Param('id', ParseIntPipe) id: number): Promise<Recetas> {
    return await this.recetasService.delete(id);
  }
}

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
import { marcasService } from './marca.service';
import { marcas as Marcas, Prisma } from '@prisma/client';

@Controller('marcas')
export class MarcasController {
  constructor(private readonly marcasService: marcasService) {}

  @Get()
  async obtenerTodos(): Promise<Marcas[]> {
    return await this.marcasService.getAll();
  }

  @Get(':id')
  async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<Marcas> {
    return await this.marcasService.getById(id);
  }

  @Post()
  async crear(@Body() data: Prisma.marcasCreateInput): Promise<Marcas> {
    return await this.marcasService.create(data);
  }

  @Put(':id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.marcasUpdateInput,
  ): Promise<Marcas> {
    return await this.marcasService.update(id, data);
  }

  @Delete(':id')
  async eliminar(@Param('id', ParseIntPipe) id: number): Promise<Marcas> {
    return await this.marcasService.delete(id);
  }
}

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
import { CategoriasService } from './categorias.service';
import { categoria as Categorias, Prisma } from '@prisma/client';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  async obtenerTodos(): Promise<Categorias[]> {
    return await this.categoriasService.findAll();
  }

  @Get(':id')
  async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<Categorias> {
    return await this.categoriasService.findOne(id);
  }

  @Post()
  async crear(@Body() data: Prisma.categoriaCreateInput): Promise<Categorias> {
    return await this.categoriasService.create(data);
  }

  @Put(':id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.categoriaCreateInput,
  ): Promise<Categorias> {
    return await this.categoriasService.update(id, data);
  }

  @Delete(':id')
  async eliminar(@Param('id', ParseIntPipe) id: number): Promise<Categorias> {
    return await this.categoriasService.remove(id);
  }
}

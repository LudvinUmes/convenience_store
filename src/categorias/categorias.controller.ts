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
import { categorias as Categoria } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@ApiTags('Categorías')
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get('GET')
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiResponse({ status: 200, description: 'Listado de categorías' })
  async obtenerTodos(): Promise<Categoria[]> {
    return await this.categoriasService.findAll();
  }

  @Get('GET/:id')
  @ApiOperation({ summary: 'Obtener categoría por ID' })
  @ApiResponse({ status: 200, description: 'Categoría encontrada' })
  async obtenerPorId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Categoria> {
    return await this.categoriasService.findOne(id);
  }

  @Post('POST')
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiResponse({ status: 201, description: 'Categoría creada' })
  async crear(@Body() data: CreateCategoriaDto): Promise<Categoria> {
    return await this.categoriasService.create(data);
  }

  @Put('PUT/:id')
  @ApiOperation({ summary: 'Actualizar una categoría existente' })
  @ApiResponse({ status: 200, description: 'Categoría actualizada' })
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCategoriaDto,
  ): Promise<Categoria> {
    return await this.categoriasService.update(id, data);
  }

  @Delete('DELETE/:id')
  @ApiOperation({ summary: 'Eliminar una categoría (lógicamente)' })
  @ApiResponse({ status: 200, description: 'Categoría eliminada' })
  async eliminar(@Param('id', ParseIntPipe) id: number): Promise<Categoria> {
    return await this.categoriasService.remove(id);
  }
}

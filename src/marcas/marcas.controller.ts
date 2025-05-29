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
import { marcas as Marcas } from '@prisma/client';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('marcas')
export class MarcasController {
  constructor(private readonly marcasService: marcasService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las marcas' })
  @ApiResponse({ status: 200, description: 'Listado de marcas' })
  async obtenerTodos(): Promise<Marcas[]> {
    return await this.marcasService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una marca por ID' })
  @ApiResponse({ status: 200, description: 'Información de marca' })
  async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<Marcas> {
    return await this.marcasService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva marca' })
  @ApiResponse({ status: 201, description: 'Marca creada' })
  async crear(@Body() data: CreateMarcaDto): Promise<Marcas> {
    return await this.marcasService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una marca existente' })
  @ApiResponse({ status: 200, description: 'Marca actualizada' })
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateMarcaDto,
  ): Promise<Marcas> {
    return await this.marcasService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una marca (lógicamente)' })
  @ApiResponse({ status: 200, description: 'Marca eliminada' })
  async eliminar(@Param('id', ParseIntPipe) id: number): Promise<Marcas> {
    return await this.marcasService.delete(id);
  }
}

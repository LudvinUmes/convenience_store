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
import { LotesService } from './lotes.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';

@ApiTags('Lotes')
@Controller('lotes')
export class LotesController {
  constructor(private readonly lotesService: LotesService) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar nuevo lote (y movimiento de inventario)',
  })
  @ApiResponse({ status: 201, description: 'Lote creado correctamente' })
  async crear(@Body() data: CreateLoteDto) {
    return this.lotesService.crearLote(data);
  }

  @Get()
  @ApiOperation({ summary: 'Listar lotes activos con stock disponible' })
  @ApiResponse({ status: 200, description: 'Lista de lotes activos' })
  async obtenerTodos() {
    return this.lotesService.obtenerLotesActivos();
  }

  @Get('/producto/:idProducto')
  @ApiOperation({ summary: 'Obtener lotes por ID de producto' })
  @ApiParam({
    name: 'idProducto',
    type: Number,
    description: 'ID del producto',
  })
  @ApiResponse({ status: 200, description: 'Lotes del producto encontrados' })
  async obtenerPorIdProducto(@Param('idProducto', ParseIntPipe) id: number) {
    return this.lotesService.obtenerLotePorIdProducto(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un lote por su ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del lote' })
  @ApiResponse({ status: 200, description: 'Lote encontrado' })
  async obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.lotesService.obtenerLotePorId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar información de un lote' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del lote' })
  @ApiResponse({ status: 200, description: 'Lote actualizado correctamente' })
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateLoteDto,
  ) {
    return this.lotesService.actualizarLote(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Inactivar un lote (eliminación lógica)' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del lote' })
  @ApiResponse({ status: 200, description: 'Lote inactivado correctamente' })
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.lotesService.inactivarLote(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';
import { UpdateCantidadDto } from './dto/update-cantidad-ingrediente.dto';
import { RecetasService } from './recetas.service';

@ApiTags('Recetas')
@Controller('')
export class RecetasController {
  constructor(private readonly recetasService: RecetasService) {}

  @Get('GET/recetas/:idProducto')
  @ApiOperation({ summary: 'Obtener receta de un producto preparado' })
  async obtenerReceta(@Param('idProducto', ParseIntPipe) id: number) {
    return this.recetasService.getRecetaPorProducto(id);
  }

  @Post('POST/recetas')
  @ApiOperation({ summary: 'Crear receta para un producto preparado' })
  async crearReceta(@Body() data: CreateRecetaDto) {
    return this.recetasService.crearReceta(data);
  }

  @Put('PUT/recetas/:idProducto')
  @ApiOperation({
    summary: 'Actualizar receta completa de un producto preparado',
  })
  async actualizarReceta(
    @Param('idProducto', ParseIntPipe) id: number,
    @Body() data: UpdateRecetaDto,
  ) {
    return this.recetasService.actualizarReceta(id, data);
  }

  @Delete('DELETE/recetas/:idAsignacion')
  @ApiOperation({ summary: 'Eliminar ingrediente de la receta' })
  async eliminarIngrediente(@Param('idAsignacion', ParseIntPipe) id: number) {
    return this.recetasService.eliminarIngrediente(id);
  }

  @Patch('PATCH/recetas/:idAsignacion')
  @ApiOperation({
    summary: 'Actualizar cantidad de un ingrediente en la receta',
  })
  async actualizarCantidad(
    @Param('idAsignacion', ParseIntPipe) id: number,
    @Body() data: UpdateCantidadDto,
  ) {
    return this.recetasService.actualizarCantidad(id, data);
  }
}

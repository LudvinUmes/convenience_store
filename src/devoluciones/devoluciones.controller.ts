import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { DevolucionesService } from './devoluciones.service';
import { devoluciones as Devoluciones, Prisma } from '@prisma/client';

/**
 * Controlador para gestionar todas las operaciones de devoluciones de la tienda.
 * Permite registrar, consultar y modificar devoluciones.
 */
@Controller('devoluciones')
export class DevolucionesController {
  constructor(private readonly devolucionesService: DevolucionesService) {}

  /**
   * Obtiene todas las devoluciones del sistema.
   * 
   * @returns Lista de todas las devoluciones
   */
  @Get()
  async obtenerDevoluciones(): Promise<Devoluciones[]> {
    return await this.devolucionesService.getAllDevoluciones();
  }

  /**
   * Encuentra una devolución específica por su ID.
   * @param id es el id de la devolución
   * @return es la información completa de la devolución solicitada
   */
  @Get(':id')
  async obtenerPorId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Devoluciones> {
    return await this.devolucionesService.getDevolucionById(id);
  }

  /**
   * Obtiene todas las devoluciones asociadas a una venta específica.
   * @param idVenta es el identificador de la venta
   * @return es la lista de devoluciones asociadas a la venta
   */
  @Get('venta/:idVenta')
  async obtenerPorVenta(
    @Param('idVenta', ParseIntPipe) idVenta: number,
  ): Promise<Devoluciones[]> {
    return await this.devolucionesService.getDevolucionesByVenta(idVenta);
  }

  /**
   * Obtiene devoluciones filtradas por su estado.
   * @param estado es el estado de las devoluciones a buscar ('pendiente', 'aprobada', 'rechazada')
   * @return es la lista de devoluciones que coinciden con el estado
   */
  @Get('estado/:estado')
  async obtenerPorEstado(
    @Param('estado') estado: string,
  ): Promise<Devoluciones[]> {
    return await this.devolucionesService.getDevolucionesByEstado(estado);
  }

  /**
   * Registra una nueva devolución en el sistema.
   * @param devolucionData son los datos necesarios para crear la devolución
   * @return es la devolución recién creada con su ID asignado
   */
  @Post()
  async crearDevolucion(
    @Body() devolucionData: Prisma.devolucionesCreateInput,
  ): Promise<Devoluciones> {
    return await this.devolucionesService.crearDevolucion(devolucionData);
  }

  /**
   * Actualiza el estado o información de una devolución existente.
   * @param id es el identificador de la devolución a modificar
   * @param devolucionData son los nuevos datos para actualizar la devolución
   * @return es la devolución con la información actualizada
   */
  @Put(':id')
  async actualizarDevolucion(
    @Param('id', ParseIntPipe) id: number,
    @Body() devolucionData: Prisma.devolucionesUpdateInput,
  ): Promise<Devoluciones> {
    return await this.devolucionesService.updateDevolucion(id, devolucionData);
  }
}

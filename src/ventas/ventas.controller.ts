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
import { VentasService } from './ventas.service';
import { ventas as Ventas, Prisma } from '@prisma/client';

/**
 * Controlador para gestionar todas las operaciones de ventas de la tienda.
 * Permite registrar, consultar, modificar y eliminar transacciones.
 */
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  /**
   * Obtiene el historial de ventas activas.
   * Por defecto solo muestra las ventas con estado = 1 (activas).
   * 
   * @returns Lista de todas las ventas activas
   */
  @Get()
  async obtenerVentas(): Promise<Ventas[]> {
    return await this.ventasService.getAllVentas();
  }

  /**
   * Obtiene el historial completo de ventas, incluyendo activas e inactivas.
   * Útil para auditorías y revisiones históricas completas.
   * 
   * @returns Lista completa de todas las ventas registradas
   */
  @Get('completo')
  async obtenerVentasCompleto(): Promise<Ventas[]> {
    return await this.ventasService.getAllVentasCompleto();
  }

  /**
   * Encuentra una venta específica por su ID.
   * El @param es el id de la venta
   * @return es la informacion completa de la venta solicitada
   */
  @Get(':id')
  async obtenerPorId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Ventas> {
    return await this.ventasService.getVentasbyId(id);
  }

  /**
   * Registra una nueva venta en el sistema.
   * @param ventaData son los datos necesarios para crear la venta
   * @return es la venta recién creada con su ID asignado
   */
  @Post()
  async crearVenta(
    @Body() ventaData: Prisma.ventasCreateInput,
  ): Promise<Ventas> {
    return await this.ventasService.crearVentas(ventaData);
  }

  /**
   * Modifica los datos de una venta existente.
   * el @param id es el identificador de la venta a modificar
   * @param ventaData son los nuevos datos para actualizar la venta
   * @return es la venta con la informacion actualizada
   */
  @Put(':id')
  async actualizarVenta(
    @Param('id', ParseIntPipe) id: number,
    @Body() ventaData: Prisma.ventasUpdateInput,
  ): Promise<Ventas> {
    return await this.ventasService.updateVenta(id, ventaData);
  }

  /**
   * Desactiva una venta en el sistema sin eliminarla realmente.
   * Cambia el estado de la venta a 0 (inactiva) para mantener el historial completo.
   * 
   * el @param id es el identificador de la venta a desactivar
   * @return es la venta que fue desactivada con su estado actualizado
   */
  @Delete(':id')
  async eliminarVenta(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Ventas> {
    return await this.ventasService.deleteVenta(id);
  }
}


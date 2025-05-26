import { Injectable } from '@nestjs/common';
import { devoluciones as Devolucion, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

/**
 * Servicio que gestiona todas las operaciones relacionadas con las devoluciones.
 * Aquí encontrarás todo lo necesario para crear, consultar, actualizar y eliminar
 * registros de devoluciones en nuestra tienda.
 */
@Injectable()
export class DevolucionesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registra una nueva devolución en el sistema.
   *
   * @param data son los datos necesarios para crear la devolución
   * @returns La devolución recién creada con su ID asignado
   */
  async crearDevolucion(
    data: Prisma.devolucionesCreateInput,
  ): Promise<Devolucion> {
    return this.prisma.devoluciones.create({
      data,
    });
  }

  /**
   * Obtiene las devoluciones según su estado.
   *
   * @returns es la lista de devoluciones que coinciden con el estado
   */
  async getDevolucionesByEstado(estado: string): Promise<Devolucion[]> {
    return this.prisma.devoluciones.findMany({
      where: { estado_devolucion: estado },
    });
  }

  /**
   * Obtiene todas las devoluciones del sistema.
   *
   * @returns es la lista completa de todas las devoluciones
   */
  async getAllDevoluciones(): Promise<Devolucion[]> {
    return this.prisma.devoluciones.findMany({});
  }

  /**
   * Busca una devolución específica por su ID.
   *
   * @param id es el identificador único de la devolución
   * @returns es la devolución encontrada
   * @throws Error si la devolución no existe
   */
  async getDevolucionById(id: number): Promise<Devolucion> {
    const devolucion = await this.prisma.devoluciones.findUnique({
      where: { id },
    });
    if (!devolucion) {
      throw new Error('Devolución no encontrada');
    }
    return devolucion;
  }

  /**
   * Actualiza la información de una devolución existente.
   *
   * @param id es el identificador de la devolución a modificar
   * @param data son los nuevos datos para actualizar la devolución
   * @returns es la devolución con la información actualizada
   */
  async updateDevolucion(
    id: number,
    data: Prisma.devolucionesUpdateInput,
  ): Promise<Devolucion> {
    return this.prisma.devoluciones.update({
      where: { id },
      data,
    });
  }

  /**
   * Obtiene todas las devoluciones asociadas a una venta específica.
   *
   * @param idVenta es el identificador de la venta
   * @returns es la lista de devoluciones asociadas a la venta
   */
  async getDevolucionesByVenta(idVenta: number): Promise<Devolucion[]> {
    return this.prisma.devoluciones.findMany({
      where: { id_venta: idVenta },
    });
  }
}

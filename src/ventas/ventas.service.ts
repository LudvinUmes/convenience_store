import { Injectable } from '@nestjs/common';
import { ventas, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

/**
 * Servicio que gestiona todas las operaciones relacionadas con las ventas.
 * Aquí encontrarás todo lo necesario para crear, consultar, actualizar y eliminar
 * registros de ventas en la tienda.
 */
@Injectable()
export class VentasService {
    constructor(private readonly prisma: PrismaService) {}
    
    /**
     * Registra una nueva venta en el sistema.
     * 
     * @param data son los datos necesarios para crear la venta
     * @returns La venta recién creada con su ID asignado
     */
    async crearVentas(data: Prisma.ventasCreateInput): Promise<ventas> {
        return this.prisma.ventas.create({
            data
        });
    }

    /**
     * Obtiene las ventas activas del sistema (estado = 1).
     * 
     * @returns es la lista de todas las ventas activas en el sistema
     */
    async getAllVentas(): Promise<ventas[]> {
        return this.prisma.ventas.findMany({
            where: { estado: 1 }
        });
    }

    /**
     * Obtiene todas las ventas del sistema, tanto activas como inactivas.
     * 
     * @returns es la lista completa de todas las ventas, incluyendo las desactivadas
     */
    async getAllVentasCompleto(): Promise<ventas[]> {
        return this.prisma.ventas.findMany({});
    }

    /**
     * Busca una venta específica por su ID.
     * 
     * @param id es el identificador único de la venta
     * @returns es la venta encontrada
     * @throws Error si la venta no existe
     */
    async getVentasbyId(id: number): Promise<ventas> {
        const venta = await this.prisma.ventas.findUnique({
            where: { id }
        });
        if (!venta) {
            throw new Error('Venta no encontrada');
        }
        return venta;
    }

    /**
     * Actualiza la información de una venta existente.
     * 
     * @param id es el identificador de la venta a modificar
     * @param data son los nuevos datos para actualizar la venta
     * @returns es la venta con la información actualizada
     */
    async updateVenta(id: number, data: Prisma.ventasUpdateInput): Promise<ventas> {
        return this.prisma.ventas.update({
            where: { id },
            data
        });
    }

    /**
     * Desactiva una venta del sistema en lugar de eliminarla.
     * @param id es el identificador de la venta a desactivar
     * @returns es la venta que fue desactivada
     */
    async deleteVenta(id: number): Promise<ventas> {
        return this.prisma.ventas.update({
            where: { id },
            data: { estado: 0 }
        });
    }
}


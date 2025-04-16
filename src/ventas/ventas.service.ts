import { Injectable } from '@nestjs/common';
import { ventas, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

/**
 * Servicio que gestiona todas las operaciones relacionadas con las ventas.
 * Aquí encontrarás todo lo necesario para crear, consultar, actualizar y eliminar
 * registros de ventas en nuestra tienda.
 */
@Injectable()
export class VentasService {
    constructor(private readonly prisma: PrismaService) {}
    
    /**
     * Registra una nueva venta en el sistema.
     * ¡Cada venta cuenta para nuestro negocio!
     * 
     * @param data Los datos necesarios para crear la venta
     * @returns La venta recién creada con su ID asignado
     */
    async crearVentas(data: Prisma.ventasCreateInput): Promise<ventas> {
        return this.prisma.ventas.create({
            data
        });
    }

    /**
     * Obtiene las ventas activas del sistema (estado = 1).
     * Útil para ver el panorama actual de nuestras transacciones válidas.
     * 
     * @returns Lista de todas las ventas activas en el sistema
     */
    async getAllVentas(): Promise<ventas[]> {
        return this.prisma.ventas.findMany({
            where: { estado: 1 }
        });
    }

    /**
     * Obtiene todas las ventas del sistema, tanto activas como inactivas.
     * Perfecto para realizar auditorías y revisiones completas.
     * 
     * @returns Lista completa de todas las ventas, incluyendo las desactivadas
     */
    async getAllVentasCompleto(): Promise<ventas[]> {
        return this.prisma.ventas.findMany({});
    }

    /**
     * Busca una venta específica por su ID.
     * ¿Necesitas revisar los detalles de una venta en particular?
     * 
     * @param id El identificador único de la venta
     * @returns La venta encontrada
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
     * Porque a veces necesitamos ajustar los detalles.
     * 
     * @param id El identificador de la venta a modificar
     * @param data Los nuevos datos para actualizar la venta
     * @returns La venta con la información actualizada
     */
    async updateVenta(id: number, data: Prisma.ventasUpdateInput): Promise<ventas> {
        return this.prisma.ventas.update({
            where: { id },
            data
        });
    }

    /**
     * Desactiva una venta del sistema en lugar de eliminarla.
     * Esta operación marca la venta como inactiva (estado = 0) pero conserva el registro
     * para mantener un historial completo de transacciones.
     * 
     * @param id El identificador de la venta a desactivar
     * @returns La venta que fue desactivada
     */
    async deleteVenta(id: number): Promise<ventas> {
        return this.prisma.ventas.update({
            where: { id },
            data: { estado: 0 }
        });
    }
}


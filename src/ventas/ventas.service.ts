import { Injectable, NotFoundException } from '@nestjs/common';
import { ventas } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegistrarVentaDto } from './dto/registrar-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';

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
  async registrarVentaCompleta(data: RegistrarVentaDto): Promise<any> {
    try {
      console.log('=== INICIANDO REGISTRO DE VENTA ===');
      console.log('Datos recibidos:', JSON.stringify(data, null, 2));

      // Validaciones previas
      if (!data.detalles || data.detalles.length === 0) {
        throw new Error('No se proporcionaron detalles de venta');
      }
      await this.prisma.$transaction(async (prisma) => {
        console.log('=== EJECUTANDO SP ===');
        // Preparar los datos para el SP
        const detallesJson = JSON.stringify(data.detalles);
        const pagosJson = JSON.stringify(data.pagos);

        console.log('JSON detalles:', detallesJson);
        console.log('JSON pagos:', pagosJson);

        const spResult = await prisma.$executeRaw`
        CALL sp_registrar_venta_completa(
          ${data.estado_venta}::VARCHAR,
          ${data.observaciones || ''}::TEXT,
          ${data.nit || ''}::VARCHAR,
          ${data.nombre || ''}::TEXT,
          ${data.usuario_creacion}::INT,
          ${detallesJson}::JSONB,
          ${pagosJson}::JSONB
        )
      `;
        console.log('SP ejecutado, resultado:', spResult);

        // Verificar que se insertaron los datos
        const ventaInsertada = await prisma.$queryRaw`
        SELECT v.*, 
               COALESCE(json_agg(dv.*) FILTER (WHERE dv.id IS NOT NULL), '[]') as detalles,
               COALESCE(json_agg(pv.*) FILTER (WHERE pv.id IS NOT NULL), '[]') as pagos
        FROM ventas v
        LEFT JOIN detalle_ventas dv ON v.id = dv.id_venta
        LEFT JOIN pagos pv ON v.id = pv.id_venta
        WHERE v.usuario_creacion = ${data.usuario_creacion}
          AND v.fecha_creacion >= NOW() - INTERVAL '1 minute'
        GROUP BY v.id
        ORDER BY v.id DESC
        LIMIT 1
      `;

        console.log('=== VERIFICACIÓN POST-INSERCIÓN ===');
        console.log(
          'Venta insertada:',
          JSON.stringify(ventaInsertada, null, 2),
        );

        return spResult;
      });

      console.log('=== TRANSACCIÓN COMPLETADA ===');

      // Consultar alertas generadas (simulación)
      const alertas = await this.prisma.alertas_stock.findMany({
        where: { atendida: false },
      });

      // Simular envío a servicio externo
      alertas.forEach((alerta) => {
        console.log(
          `📦 Enviando alerta: Producto ${alerta.id_producto}, Stock actual: ${alerta.stock_actual}`,
        );
        // Aquí podrías usar HttpService de NestJS para hacer un POST real
      });

      return {
        message: 'Venta registrada exitosamente y alertas procesadas',
      };
    } catch (error: any) {
      console.error('=== ERROR EN REGISTRO DE VENTA ===');
      console.error('Error completo:', error);
      console.error('Stack trace:', error.stack);

      // Si es un error de Prisma, mostrar más detalles
      if (error.code) {
        console.error('Código de error:', error.code);
        console.error('Meta:', error.meta);
      }

      throw new Error(`Error al registrar venta: ${error.message}`);
    }
  }

  /**
   * Obtiene las ventas activas del sistema (estado = 1).
   *
   * @returns es la lista de todas las ventas activas en el sistema
   */
  async getAllVentas(): Promise<ventas[]> {
    return this.prisma.ventas.findMany({
      where: { estado: 1 },
    });
  }

  /**
   * Obtiene todas las ventas del sistema, tanto activas como inactivas.
   *
   * @returns es la lista completa de todas las ventas, incluyendo las desactivadas
   */
  async getAllVentasCompleto(): Promise<ventas[]> {
    return this.prisma.ventas.findMany({
      include: {
        detalle_ventas: {
          include: {
            productos: true, // Incluir información del producto
          },
        },
      },
      where: { estado: 1 },
      orderBy: { fecha_creacion: 'desc' }, // Ordenar por fecha de creación
    });
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
      include: {
        detalle_ventas: {
          include: {
            productos: true,
          },
        },
      },
      where: { id },
    });
    if (!venta) {
      throw new NotFoundException('Venta no encontrada');
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
  async updateVenta(id: number, data: UpdateVentaDto): Promise<ventas> {
    return this.prisma.ventas.update({
      where: { id },
      data,
    });
  }

  async marcarDetalleComoDevuelto(
    idVenta: number,
    usuarioModificacion: number,
  ): Promise<void> {
    await this.prisma.detalle_ventas.updateMany({
      where: { id_venta: idVenta, estado: 1 },
      data: {
        estado: 2,
        fecha_modificacion: new Date(),
        usuario_modificacion: usuarioModificacion,
      },
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
      data: { estado: 0 },
    });
  }
}

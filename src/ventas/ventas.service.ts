import {
  Injectable,
  NotFoundException,
  HttpException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegistrarVentaDto } from './dto/registrar-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ventas } from '@prisma/client';

/**
 * Servicio que gestiona todas las operaciones relacionadas con las ventas.
 * Aquí encontrarás todo lo necesario para crear, consultar, actualizar y eliminar
 * registros de ventas en la tienda.
 */
@Injectable()
export class VentasService {
  private readonly ID_CAJA = process.env.ID_CAJA_DEFAULT || '1';
  private readonly ID_SERVICIO =
    process.env.ID_SERVICIO_TRANSACCION_DEFAULT || '1';
  private readonly logger = new Logger(VentasService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService, // <-- aquí inyectamos HttpService
  ) {}

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

      if (!data.nit) {
        throw new Error('No se proporcionó NIT del cliente');
      }

      // 0) CONSULTAR TODOS LOS CLIENTES y verificar si el NIT existe o no
      let todosClientes: any[];
      try {
        const respuesta$: Promise<AxiosResponse> = firstValueFrom(
          this.httpService.get(
            'http://64.23.169.22:3001/pagos/cliente/obtener',
          ),
        );
        const res = await respuesta$;
        todosClientes = res.data.clientes;
      } catch (err: any) {
        this.logger.error(
          'Error al obtener lista de clientes desde API de pagos',
          err.stack,
        );
        throw new Error(
          'No se pudo verificar existencia del NIT en la API de pagos',
        );
      }

      // Buscar el cliente por su NIT en el arreglo recibido
      let clienteEncontrado = todosClientes.find((c) => c.nit === data.nit);
      if (!clienteEncontrado) {
        console.log(
          `❌ El NIT ${data.nit} no existe. Se creará un cliente nuevo...`,
        );

        // Llamada al endpoint para crear un nuevo cliente
        const Dpi = Date.now().toString();
        try {
          const clientePayload = {
            NombreCliente: data.nombre,
            ApellidosCliente: data.nombre,
            Nit: data.nit || 'CF',
            Direccion: 'Ciudad',
            Telefono: '00000000',
            Email: 'correo@correo.com',
            Dpi: Dpi,
          };

          console.log(clientePayload);

          const crearCliente$: Promise<AxiosResponse> = firstValueFrom(
            this.httpService.post(
              'http://64.23.169.22:3001/pagos/cliente/crear',
              clientePayload,
            ),
          );
          const res = await crearCliente$;
          console.log(res.data);
          clienteEncontrado = res.data;

          console.log(`✔️ Cliente nuevo creado con ID:`, clienteEncontrado._id);
        } catch (err: any) {
          this.logger.error(
            'Error al crear cliente nuevo en API de pagos',
            err.stack,
          );
          throw new Error(
            'No se pudo crear un nuevo cliente en la API de pagos',
          );
        }
      } else {
        console.log(
          `✔️ El NIT ${data.nit} existe (ID interno: ${clienteEncontrado._id})`,
        );
      }

      try {
        // 1. Obtener los detalles del producto desde DB
        const productosInfo = await Promise.all(
          data.detalles.map(async (detalle) => {
            const producto = await this.prisma.productos.findUnique({
              where: { id: detalle.id_producto },
              select: {
                nombre: true,
                precio_referencia: true,
              },
            });

            if (!producto) {
              throw new Error(
                `Producto con ID ${detalle.id_producto} no encontrado`,
              );
            }

            return {
              Producto: producto.nombre,
              Cantidad: detalle.cantidad.toString(),
              Precio: producto.precio_referencia.toString(),
              Descuento: '0', // Puedes ajustar si hay descuento
            };
          }),
        );

        // 2. Mapear métodos de pago
        const metodosPagoPayload = data.pagos.map((pago) => {
          return {
            NoTarjeta: '0000',
            IdMetodo: '1', // Por defecto EFECTIVO = 1
            Monto: pago.monto.toString(),
            IdBanco: '1',
          };
        });

        // 3. Construir el payload final
        const transaccionPayload = {
          Nit: data.nit || 'CF',
          IdCaja: '1',
          IdServicioTransaccion: '5',
          Detalle: productosInfo,
          MetodosPago: metodosPagoPayload,
        };
        console.log(transaccionPayload);
        console.log('⏩ Enviando datos a /transacciones/crear:');

        const respuesta$: Promise<AxiosResponse> = firstValueFrom(
          this.httpService.post(
            'http://64.23.169.22:3001/pagos/transacciones/crear',
            transaccionPayload,
          ),
        );

        const res = await respuesta$;
        console.log('✅ Transacción registrada en sistema externo:', res.data);
      } catch (err: any) {
        this.logger.error(
          '❌ Error al registrar transacción externa',
          err.stack,
        );
        throw new Error('Error al registrar transacción en sistema de pagos');
      }

      // Validación de detalles (una sola vez)
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
    try {
      const updatedVenta = await this.prisma.ventas.update({
        where: { id },
        data,
      });
      return updatedVenta;
    } catch (error: any) {
      if (error.code === 'P2025') {
        // Prisma error code for "Record not found"
        throw new NotFoundException(`Venta con id ${id} no encontrada`);
      }
      console.error('Error al actualizar la venta:', error);
      throw new Error(`Error al actualizar la venta: ${error.message}`);
    }
  }

  async marcarDetalleComoDevuelto(
    idVenta: number,
    usuarioModificacion: number,
  ): Promise<void> {
    try {
      const result = await this.prisma.detalle_ventas.updateMany({
        where: { id_venta: idVenta, estado: 1 },
        data: {
          estado: 2,
          fecha_modificacion: new Date(),
          usuario_modificacion: usuarioModificacion,
        },
      });

      if (result.count === 0) {
        throw new NotFoundException(
          `No se encontraron detalles activos para la venta con id ${idVenta}`,
        );
      }
    } catch (error: any) {
      console.error('Error al marcar detalle como devuelto:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Error al marcar detalle como devuelto: ${error.message}`,
      );
    }
  }

  /**
   * Desactiva una venta del sistema en lugar de eliminarla.
   * @param id es el identificador de la venta a desactivar
   * @returns es la venta que fue desactivada
   */
  async deleteVenta(id: number): Promise<ventas> {
    try {
      const venta = await this.prisma.ventas.update({
        where: { id },
        data: { estado: 0 },
      });
      return venta;
    } catch (error: any) {
      if (error.code === 'P2025') {
        // Prisma error code for "Record not found"
        throw new NotFoundException(`Venta con id ${id} no encontrada`);
      }
      console.error('Error al desactivar la venta:', error);
      throw new Error(`Error al desactivar la venta: ${error.message}`);
    }
  }
}

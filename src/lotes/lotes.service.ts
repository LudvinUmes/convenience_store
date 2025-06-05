import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';

@Injectable()
export class LotesService {
  constructor(private readonly prisma: PrismaService) {}

  async crearLote(data: CreateLoteDto) {
    if (
      isNaN(Date.parse(data.fecha_ingreso)) ||
      isNaN(Date.parse(data.fecha_vencimiento))
    ) {
      throw new BadRequestException(
        'Fechas inválidas. Asegúrate de usar formato ISO (YYYY-MM-DD).',
      );
    }
    try {
      await this.prisma.$executeRaw`
      CALL sp_registrar_lote_y_movimiento(
        ${data.id_producto}::INT,
        ${data.costo_unitario}::DECIMAL,
        ${data.precio_lote}::DECIMAL,
        ${data.stock}::INT,
        ${new Date(data.fecha_ingreso)}::TIMESTAMP,
        ${new Date(data.fecha_vencimiento)}::TIMESTAMP,
        ${data.descripcion || null}::TEXT,
        ${data.usuario_creacion}::INT
      )
    `;

      return {
        message: 'Lote y movimiento registrados correctamente',
        lote: {
          producto: data.id_producto,
          cantidad: data.stock,
          fecha_ingreso: data.fecha_ingreso,
        },
      };
    } catch (error: any) {
      throw new InternalServerErrorException(
        'Error al registrar el lote',
        error.message,
      );
    }
  }

  async obtenerLotesActivos() {
    return this.prisma.lote_productos.findMany({
      where: {
        estado: 1,
        stock: { gt: 0 },
      },
      include: {
        productos: {
          select: {
            nombre: true,
            unidades_medida: true,
            categoria: true,
          },
        },
      },
      orderBy: { fecha_ingreso: 'desc' },
    });
  }

  async obtenerLotePorIdProducto(id: number) {
    const lote = await this.prisma.lote_productos.findMany({
      where: { id_producto: id, estado: 1 },
      include: { movimientos_inventario: true },
    });
    if (!lote) throw new NotFoundException('Lote no encontrado');
    return lote;
  }

  async obtenerLotePorId(id: number) {
    console.log('Obteniendo lote por ID:', id);
    const lote = await this.prisma.lote_productos.findUnique({
      where: { id, estado: 1 },
      include: { movimientos_inventario: true },
    });
    if (!lote) throw new NotFoundException('Lote no encontrado');
    return lote;
  }

  async actualizarLote(id: number, data: UpdateLoteDto) {
    try {
      await this.obtenerLotePorId(id);
      return await this.prisma.lote_productos.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al actualizar el lote',
        error.message,
      );
    }
  }

  async inactivarLote(id: number) {
    try {
      await this.obtenerLotePorId(id);
      return await this.prisma.lote_productos.update({
        where: { id },
        data: { estado: 0 },
      });
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al inactivar el lote',
        error.message,
      );
    }
  }
}

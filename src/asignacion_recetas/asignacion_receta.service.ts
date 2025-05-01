import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { asignacion_receta_materia_prima as AsignacionReceta, Prisma } from '@prisma/client';

@Injectable()
export class AsignacionRecetaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<AsignacionReceta[]> {
    return await this.prisma.asignacion_receta_materia_prima.findMany({
      where: {
        estado: { not: 0 },
      },
    });
  }

  async findByReceta(recetaId: number): Promise<AsignacionReceta[]> {
    return await this.prisma.asignacion_receta_materia_prima.findMany({
      where: {
        id_receta: recetaId,
        estado: { not: 0 },
      },
    });
  }

  async findByMateriaPrima(materiaPrimaId: number): Promise<AsignacionReceta[]> {
    return await this.prisma.asignacion_receta_materia_prima.findMany({
      where: {
        id_producto: materiaPrimaId,
        estado: { not: 0 },
      },
    });
  }

  async findOne(productoId: number, recetaId: number): Promise<AsignacionReceta> {
    const asignacion = await this.prisma.asignacion_receta_materia_prima.findUnique({
      where: {
        id_producto_id_receta: {
          id_producto: productoId,
          id_receta: recetaId,
        },
      },
    });

    if (!asignacion || asignacion.estado === 0) {
      throw new NotFoundException(`Asignación de materia prima ${productoId} a receta ${recetaId} no encontrada`);
    }

    return asignacion;
  }

  async create(data: Prisma.asignacion_receta_materia_primaUncheckedCreateInput): Promise<AsignacionReceta> {
    // Verificar si la materia prima existe
    const materiaPrima = await this.prisma.productos.findUnique({
      where: { id: Number(data.id_producto) },
    });

    if (!materiaPrima) {
      throw new NotFoundException(`El producto ${data.id_producto} no existe`);
    }

    // Verificar si la receta existe
    const receta = await this.prisma.recetas.findUnique({
      where: { id: Number(data.id_receta) },
    });

    if (!receta) {
      throw new NotFoundException(`La receta ${data.id_receta} no existe`);
    }

    // Preparamos los datos con valores por defecto para campos opcionales
    const asignacionData: Prisma.asignacion_receta_materia_primaUncheckedCreateInput = {
      id_producto: data.id_producto,
      id_receta: data.id_receta,
      unidad_medida: data.unidad_medida || 'unidad',
      cantidad_requerida: data.cantidad_requerida || 1,
      usuario_creacion: data.usuario_creacion,
      fecha_creacion: data.fecha_creacion || new Date(),
      estado: data.estado || 1
    };

    return await this.prisma.asignacion_receta_materia_prima.create({
      data: asignacionData,
    });
  }

  async update(
    productoId: number,
    recetaId: number,
    data: Prisma.asignacion_receta_materia_primaUncheckedUpdateInput,
  ): Promise<AsignacionReceta> {
    // Verificar que exista la asignación
    await this.findOne(productoId, recetaId);

    return await this.prisma.asignacion_receta_materia_prima.update({
      where: {
        id_producto_id_receta: {
          id_producto: productoId,
          id_receta: recetaId,
        },
      },
      data,
    });
  }

  async remove(productoId: number, recetaId: number): Promise<AsignacionReceta> {
    // Verificar que exista la asignación
    await this.findOne(productoId, recetaId);

    // Soft delete: actualizar el estado a 0
    return await this.prisma.asignacion_receta_materia_prima.update({
      where: {
        id_producto_id_receta: {
          id_producto: productoId,
          id_receta: recetaId,
        },
      },
      data: { estado: 0 },
    });
  }
}
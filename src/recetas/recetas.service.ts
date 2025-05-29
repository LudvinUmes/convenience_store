import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';
import { UpdateCantidadDto } from './dto/update-cantidad-ingrediente.dto';

@Injectable()
export class RecetasService {
  constructor(private readonly prisma: PrismaService) {}

  async getRecetaPorProducto(idProducto: number) {
    const receta =
      await this.prisma.asignacion_producto_preparado_materia_prima.findMany({
        where: { id_producto_preparado: idProducto, estado: 1 },
        include: {
          productoMateriaPrima: {
            select: {
              id: true,
              nombre: true,
              descripcion: true,
              precio_referencia: true,
              unidades_medida: {
                select: {
                  nombre: true,
                  abreviatura: true,
                },
              },
            },
          },
        },
      });

    return receta;
  }

  async crearReceta(data: CreateRecetaDto) {
    // Verificar si el producto preparado ya tiene una receta
    const recetaExistente =
      await this.prisma.asignacion_producto_preparado_materia_prima.findFirst({
        where: { id_producto_preparado: data.id_producto_preparado },
      });

    if (recetaExistente) {
      throw new NotFoundException(
        'El producto preparado ya tiene una receta asignada',
      );
    }

    // Crear asignaciones de ingredientes
    const ingredientes = data.ingredientes.map((i) => ({
      id_producto_preparado: data.id_producto_preparado,
      id_producto_materia_prima: i.id_producto_materia_prima,
      cantidad_requerida: i.cantidad_requerida,
      usuario_creacion: data.usuario_creacion,
      fecha_creacion: new Date(),
    }));

    return await this.prisma.asignacion_producto_preparado_materia_prima.createMany(
      {
        data: ingredientes,
        skipDuplicates: true,
      },
    );
  }

  async actualizarReceta(idProducto: number, data: UpdateRecetaDto) {
    // Eliminar asignaciones previas
    await this.prisma.asignacion_producto_preparado_materia_prima.deleteMany({
      where: { id_producto_preparado: idProducto },
    });

    // Crear nuevas
    const nuevasAsignaciones = data.nueva_receta.map((i) => ({
      id_producto_preparado: idProducto,
      id_producto_materia_prima: i.id_producto_materia_prima,
      cantidad_requerida: i.cantidad_requerida,
      usuario_creacion: data.usuario_modificacion,
      fecha_creacion: new Date(),
    }));

    return await this.prisma.asignacion_producto_preparado_materia_prima.createMany(
      {
        data: nuevasAsignaciones,
      },
    );
  }

  async eliminarIngrediente(idAsignacion: number) {
    const asignacion =
      await this.prisma.asignacion_producto_preparado_materia_prima.findUnique({
        where: { id: idAsignacion },
      });

    if (!asignacion) {
      throw new NotFoundException('Ingrediente no encontrado');
    }

    return await this.prisma.asignacion_producto_preparado_materia_prima.delete(
      {
        where: { id: idAsignacion },
      },
    );
  }

  async actualizarCantidad(idAsignacion: number, data: UpdateCantidadDto) {
    return await this.prisma.asignacion_producto_preparado_materia_prima.update(
      {
        where: { id: idAsignacion },
        data: {
          cantidad_requerida: data.cantidad_requerida,
          usuario_modificacion: data.usuario_modificacion,
          fecha_modificacion: new Date(),
        },
      },
    );
  }
}

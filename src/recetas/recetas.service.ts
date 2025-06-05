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
    try {
      // Verificar si el producto preparado ya tiene una receta
      const recetaExistente =
        await this.prisma.asignacion_producto_preparado_materia_prima.findFirst(
          {
            where: { id_producto_preparado: data.id_producto_preparado },
          },
        );

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
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Prisma error handling
      if (error.code === 'P2002') {
        throw new NotFoundException('Duplicated ingredient assignment');
      }
      throw new NotFoundException('Error al crear la receta: ' + error.message);
    }
  }

  async actualizarReceta(idProducto: number, data: UpdateRecetaDto) {
    try {
      // Verificar si existen asignaciones previas
      const asignacionesPrevias =
        await this.prisma.asignacion_producto_preparado_materia_prima.findMany({
          where: { id_producto_preparado: idProducto },
        });

      if (asignacionesPrevias.length === 0) {
        throw new NotFoundException(
          'No se encontró una receta previa para este producto',
        );
      }

      // Eliminar asignaciones previas
      await this.prisma.asignacion_producto_preparado_materia_prima.deleteMany({
        where: { id_producto_preparado: idProducto },
      });

      // Crear nuevas asignaciones
      const nuevasAsignaciones = data.nueva_receta.map((i) => ({
        id_producto_preparado: idProducto,
        id_producto_materia_prima: i.id_producto_materia_prima,
        cantidad_requerida: i.cantidad_requerida,
        usuario_creacion: data.usuario_modificacion,
        fecha_creacion: new Date(),
      }));

      const result =
        await this.prisma.asignacion_producto_preparado_materia_prima.createMany(
          {
            data: nuevasAsignaciones,
          },
        );

      if (result.count === 0) {
        throw new NotFoundException(
          'No se pudieron crear las nuevas asignaciones de ingredientes',
        );
      }

      return result;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new NotFoundException('Asignación de ingrediente duplicada');
      }
      throw new NotFoundException(
        'Error al actualizar la receta: ' + error.message,
      );
    }
  }

  async eliminarIngrediente(idAsignacion: number) {
    try {
      const asignacion =
        await this.prisma.asignacion_producto_preparado_materia_prima.findUnique(
          {
            where: { id: idAsignacion },
          },
        );

      if (!asignacion) {
        throw new NotFoundException('Ingrediente no encontrado');
      }

      return await this.prisma.asignacion_producto_preparado_materia_prima.delete(
        {
          where: { id: idAsignacion },
        },
      );
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2025') {
        // Prisma: Record to delete does not exist
        throw new NotFoundException(
          'No se pudo eliminar: ingrediente no encontrado',
        );
      }
      throw new NotFoundException(
        'Error al eliminar el ingrediente: ' + error.message,
      );
    }
  }

  async actualizarCantidad(idAsignacion: number, data: UpdateCantidadDto) {
    try {
      const asignacion =
        await this.prisma.asignacion_producto_preparado_materia_prima.findUnique(
          {
            where: { id: idAsignacion },
          },
        );

      if (!asignacion) {
        throw new NotFoundException('Ingrediente no encontrado');
      }

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
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(
          'No se pudo actualizar: ingrediente no encontrado',
        );
      }
      throw new NotFoundException(
        'Error al actualizar la cantidad: ' + error.message,
      );
    }
  }
}

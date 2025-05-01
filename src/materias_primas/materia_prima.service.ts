import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { productos as Producto, Prisma } from '@prisma/client';

@Injectable()
export class MateriaPrimaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Producto[]> {
    return await this.prisma.productos.findMany({
      where: {
        es_materia_prima: true,
        estado: { not: 0 }, 
      },
    });
  }

  async findOne(id: number): Promise<Producto> {
    const materiaPrima = await this.prisma.productos.findFirst({
      where: { 
        id, 
        es_materia_prima: true,
        estado: { not: 0 }, 
      },
    });
    
    if (!materiaPrima) {
      throw new NotFoundException(`Materia prima con ID ${id} no encontrada`);
    }
    
    return materiaPrima;
  }

  async create(data: Prisma.productosUncheckedCreateInput): Promise<Producto> {
    
    const materiaPrimaData: Prisma.productosUncheckedCreateInput = {
      nombre: data.nombre,
      descripcion: data.descripcion || null,
      precio_referencia: data.precio_referencia || 0,
      unidad_medida: data.unidad_medida || 'unidad',
      stock: data.stock || 0,
      stock_minimo: data.stock_minimo || 0,
      id_tipo: data.id_tipo || 1,
      id_marca: data.id_marca || 1,
      id_receta: data.id_receta || 1,
      es_materia_prima: true, 
      usuario_creacion: data.usuario_creacion,
      fecha_creacion: data.fecha_creacion || new Date(),
      estado: data.estado || 1,
    };
    
    return await this.prisma.productos.create({
      data: materiaPrimaData,
    });
  }

  async update(id: number, data: Prisma.productosUncheckedUpdateInput): Promise<Producto> {
    await this.findOne(id);

    if (data.es_materia_prima === false) {
      delete data.es_materia_prima;
    }
    
    return await this.prisma.productos.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Producto> {
    await this.findOne(id);
    
    return await this.prisma.productos.update({
      where: { id },
      data: { estado: 0 },
    });
  }

  async getByCategoria(categoriaId: number): Promise<Producto[]> {
    return await this.prisma.productos.findMany({
      where: {
        id_tipo: categoriaId,
        es_materia_prima: true,
        estado: { not: 0 },
      },
    });
  }

  async getBajoStock(): Promise<Producto[]> {
    return await this.prisma.productos.findMany({
      where: {
        es_materia_prima: true,
        estado: { not: 0 },
        stock: {
          lte: this.prisma.productos.fields.stock_minimo,
        },
      },
    });
  }
}
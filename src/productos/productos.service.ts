import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { productos as Producto, Prisma } from '@prisma/client';
import { CreateProductoDto } from './dto/create-producto.dto';

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProducts(filters?: {
    tipo?: 'FINAL' | 'PREPARADO';
    id_categoria?: number;
    es_materia_prima?: boolean;
  }): Promise<Producto[]> {
    const { tipo, id_categoria, es_materia_prima } = filters || {};
    return await this.prisma.productos.findMany({
      include: {
        categoria: true,
        marca: true,
        preparadoComoProductoFinal: {
          include: {
            productoMateriaPrima: {
              select: {
                id: true,
                nombre: true,
                descripcion: true,
                precio_referencia: true,
                unidades_medida: true,
              },
            },
          },
        },
      },
      where: {
        estado: 1,
        ...(tipo && { tipo }),
        ...(id_categoria && { id_categoria }),
        ...(es_materia_prima !== undefined && { es_materia_prima }),
      },
      orderBy: { id: 'asc' },
    });
  }

  async getById(id: number): Promise<Producto> {
    const product = await this.prisma.productos.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

  async createProduct(data: CreateProductoDto): Promise<Producto> {
    return await this.prisma.productos.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio_referencia: new Prisma.Decimal(data.precio_referencia),
        stock_minimo: data.stock_minimo,
        tipo: data.tipo,
        es_materia_prima: data.es_materia_prima,
        receta: data.receta,
        usuario_creacion: data.usuario_creacion,

        categoria: {
          connect: { id: data.id_categoria },
        },
        unidades_medida: {
          connect: { id: data.id_unidad_medida },
        },
        ...(data.id_marca && {
          marca: {
            connect: { id: data.id_marca },
          },
        }),
      },
    });
  }

  async updateProduct(
    id: number,
    data: Prisma.productosUpdateInput,
  ): Promise<Producto> {
    await this.getById(id);
    return await this.prisma.productos.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: number): Promise<Producto> {
    await this.getById(id);
    return await this.prisma.productos.update({
      where: { id },
      data: { estado: 0 },
    });
  }
}

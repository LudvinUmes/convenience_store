import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { productos as Producto, Prisma } from '@prisma/client';

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProducts(): Promise<Producto[]> {
    return await this.prisma.productos.findMany({
      include: {
        categoria: true,
        marca: true,
      },
      where: { estado: 1 },
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

  async createProduct(data: Prisma.productosCreateInput): Promise<Producto> {
    return await this.prisma.productos.create({
      data,
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

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { productos as Productos, Prisma } from '@prisma/client';

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProducts(): Promise<Productos[]> {
    return await this.prisma.productos.findMany();
  }

  async getById(id: number): Promise<Productos> {
    const product = await this.prisma.productos.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

  async createProduct(data: Prisma.productosCreateInput): Promise<Productos> {
    return await this.prisma.productos.create({
      data,
    });
  }

  async updateProduct(
    id: number,
    data: Prisma.productosUpdateInput,
  ): Promise<Productos> {
    await this.getById(id);
    return await this.prisma.productos.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: number): Promise<Productos> {
    await this.getById(id);
    return await this.prisma.productos.update({
      where: { id },
      data: { estado: 0 },
    });
  }
}

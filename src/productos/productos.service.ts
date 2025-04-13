import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { productos as Producto, Prisma } from '@prisma/client';

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  // Obtener todos los productos
  async getAllProducts(): Promise<Producto[]> {
    return await this.prisma.productos.findMany();
  }

  // Obtener un producto por ID
  async getById(id: number): Promise<Producto> {
    const product = await this.prisma.productos.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

  // Crear un nuevo producto
  async createProduct(data: Prisma.productosCreateInput): Promise<Producto> {
    return await this.prisma.productos.create({
      data,
    });
  }

  // Actualizar un producto
  async updateProduct(
    id: number,
    data: Prisma.productosUpdateInput,
  ): Promise<Producto> {
    await this.getById(id); // Verifica si el producto existe
    return await this.prisma.productos.update({
      where: { id },
      data,
    });
  }

  // Eliminar un producto (borrado lógico)
  async deleteProduct(id: number): Promise<Producto> {
    await this.getById(id); // Verifica si el producto existe
    return await this.prisma.productos.update({
      where: { id },
      data: { estado: 0 }, // Borrado lógico, cambio el estado a 0
    });
  }
}

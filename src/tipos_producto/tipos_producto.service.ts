import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { tipos_producto as Tipos_producto, Prisma } from '@prisma/client';

@Injectable()
export class tipos_productoService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<Tipos_producto[]> {
    return await this.prisma.tipos_producto.findMany();
  }

  async getById(id: number): Promise<Tipos_producto> {
    const item = await this.prisma.tipos_producto.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException(`Elemento con ID ${id} no encontrado`);
    }
    return item;
  }

  async create(data: Prisma.tipos_productoCreateInput): Promise<Tipos_producto> {
    return await this.prisma.tipos_producto.create({ data });
  }

  async update(id: number, data: Prisma.tipos_productoUpdateInput): Promise<Tipos_producto> {
    await this.getById(id);
    return await this.prisma.tipos_producto.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Tipos_producto> {
    await this.getById(id);
    return await this.prisma.tipos_producto.update({
      where: { id },
      data: { estado: 0 },
    });
  }
}

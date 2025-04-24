import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { lote_productos as Lote_productos, Prisma } from '@prisma/client';

@Injectable()
export class lote_productosService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<Lote_productos[]> {
    return await this.prisma.lote_productos.findMany();
  }

  async getById(id: number): Promise<Lote_productos> {
    const item = await this.prisma.lote_productos.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException(`Elemento con ID ${id} no encontrado`);
    }
    return item;
  }

  async create(data: Prisma.lote_productosCreateInput): Promise<Lote_productos> {
    return await this.prisma.lote_productos.create({ data });
  }

  async update(id: number, data: Prisma.lote_productosUpdateInput): Promise<Lote_productos> {
    await this.getById(id);
    return await this.prisma.lote_productos.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Lote_productos> {
    await this.getById(id);
    return await this.prisma.lote_productos.update({
      where: { id },
      data: { estado: 0 },
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { marcas as Marcas, Prisma } from '@prisma/client';

@Injectable()
export class marcasService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<Marcas[]> {
    return await this.prisma.marcas.findMany({
      where: { estado: 1 },
    });
  }

  async getById(id: number): Promise<Marcas> {
    const item = await this.prisma.marcas.findUnique({
      where: { id, estado: 1 },
    });
    if (!item) {
      throw new NotFoundException(`Marca con ID ${id} no encontrada`);
    }
    return item;
  }

  async create(data: Prisma.marcasCreateInput): Promise<Marcas> {
    return await this.prisma.marcas.create({
      data: { ...data, fecha_creacion: new Date(), estado: 1 },
    });
  }

  async update(id: number, data: Prisma.marcasUpdateInput): Promise<Marcas> {
    await this.getById(id);
    return await this.prisma.marcas.update({
      where: { id },
      data: {
        ...data,
        fecha_modificacion: new Date(),
      },
    });
  }

  async delete(id: number): Promise<Marcas> {
    await this.getById(id);
    return await this.prisma.marcas.update({
      where: { id },
      data: { estado: 0 },
    });
  }
}

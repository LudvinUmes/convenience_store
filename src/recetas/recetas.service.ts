import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { recetas as Recetas, Prisma } from '@prisma/client';

@Injectable()
export class RecetasService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<Recetas[]> {
    return await this.prisma.recetas.findMany();
  }

  async getById(id: number): Promise<Recetas> {
    const item = await this.prisma.recetas.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException(`Elemento con ID ${id} no encontrado`);
    }
    return item;
  }

  async create(data: Prisma.recetasCreateInput): Promise<Recetas> {
    return await this.prisma.recetas.create({ data });
  }

  async update(id: number, data: Prisma.recetasUpdateInput): Promise<Recetas> {
    await this.getById(id);
    return await this.prisma.recetas.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Recetas> {
    await this.getById(id);
    return await this.prisma.recetas.update({
      where: { id },
      data: { estado: 0 },
    });
  }
}

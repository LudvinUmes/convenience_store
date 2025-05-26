import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { categorias as Categoria, Prisma } from '@prisma/client';

@Injectable()
export class CategoriasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.categoriasCreateInput): Promise<Categoria> {
    return await this.prisma.categorias.create({
      data,
    });
  }

  async findAll(): Promise<Categoria[]> {
    return this.prisma.categorias.findMany({
      include: {
        productos: true,
      },
      where: {
        estado: 1, // Solo categorías activas
      },
    });
  }

  async findOne(id: number): Promise<Categoria> {
    return (
      (await this.prisma.categorias.findUnique({
        where: { id, estado: 1 }, // Solo categorías activas
      })) ?? Promise.reject(new Error('Categoría no encontrada'))
    );
  }

  async update(
    id: number,
    data: Prisma.categoriasUpdateInput,
  ): Promise<Categoria> {
    return await this.prisma.categorias.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Categoria> {
    return await this.prisma.categorias.delete({
      where: { id },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { categoria, Prisma } from '@prisma/client';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.categoriaCreateInput): Promise<categoria> {
    return this.prisma.categoria.create({
      data,
    });
  }

  async findAll(): Promise<categoria[]> {
    return this.prisma.categoria.findMany({
      include: {
        productos: true,
      },
    });
  }

  async findOne(id: number): Promise<categoria> {
    const result = await this.prisma.categoria.findUnique({
      where: { id },
      include: {
        productos: true,
      },
    });
    
    if (!result) {
      throw new Error(`Categoría con ID ${id} no encontrada`);
    }
    
    return result;
  }

  async update(id: number, data: Prisma.categoriaUpdateInput): Promise<categoria> {
    return this.prisma.categoria.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<categoria> {
    return this.prisma.categoria.delete({
      where: { id },
    });
  }
}
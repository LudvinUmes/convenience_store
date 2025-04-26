import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Categoria as Categorias, Prisma } from '@prisma/client';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CategoriaCreateInput): Promise<Categorias> {
    const prismaAny = this.prisma as any;
    return prismaAny.categoria.create({
      data,
    });
  }

  async findAll(): Promise<Categorias[]> {
    const prismaAny = this.prisma as any;
    return prismaAny.categoria.findMany({
      include: {
        productos: true,
      },
    });
  }

  async findOne(id: number): Promise<Categorias> {
    const prismaAny = this.prisma as any;
    return prismaAny.categoria.findUnique({
      where: { id },
      include: {
        productos: true,
      },
    });
  }

  async update(id: number, data: Prisma.CategoriaUpdateInput): Promise<Categorias> {
    const prismaAny = this.prisma as any;
    return prismaAny.categoria.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Categorias> {
    const prismaAny = this.prisma as any;
    return prismaAny.categoria.delete({
      where: { id },
    });
  }
}

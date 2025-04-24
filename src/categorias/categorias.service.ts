import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoriaDto: any) {
    return this.prisma.categoria.create({
      data: createCategoriaDto,
    });
  }

  async findAll() {
    return this.prisma.categoria.findMany({
      include: {
        productos: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.categoria.findUnique({
      where: { id },
      include: {
        productos: true,
      },
    });
  }

  async update(id: number, updateCategoriaDto: any) {
    return this.prisma.categoria.update({
      where: { id },
      data: updateCategoriaDto,
    });
  }

  async remove(id: number) {
    return this.prisma.categoria.delete({
      where: { id },
    });
  }
}
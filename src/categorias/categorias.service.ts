import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { categorias as Categoria } from '@prisma/client';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoriaDto): Promise<Categoria> {
    return await this.prisma.categorias.create({
      data: {
        ...data,
        fecha_creacion: new Date(),
        estado: 1,
      },
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

  async update(id: number, data: UpdateCategoriaDto): Promise<Categoria> {
    return this.prisma.categorias.update({
      where: { id },
      data: {
        ...data,
        fecha_modificacion: new Date(),
      },
    });
  }

  async remove(id: number): Promise<Categoria> {
    return await this.prisma.categorias.update({
      where: { id },
      data: {
        estado: 0, // Cambiar estado a inactivo
        fecha_modificacion: new Date(),
      },
    });
  }
}

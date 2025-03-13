import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { productos as Productos } from '@prisma/client';
@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProducts(): Promise<Productos[]> {
    return await this.prisma.productos.findMany();
  }
}
// EJEMPLO DE TASKS
// import { Task } from '@prisma/client';
// import { PrismaService } from '../src/prisma/prisma.service';
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class TaskService {
//   constructor(private prisma: PrismaService) {}

//   async getAllTasks(): Promise<Task[]> {
//     return this.prisma.task.findMany();
//   }

//   async getTaskById(id: number): Promise<Task | null> {
//     return this.prisma.task.findUnique({
//       where: {
//         id: id,
//       },
//     });
//   }

//   async createTask(data: Task): Promise<Task> {
//     return this.prisma.task.create({
//       data,
//     });
//   }

//   async updateTask(id: number, data: Task): Promise<Task> {
//     return this.prisma.task.update({
//       where: {
//         id: id,
//       },
//       data,
//     });
//   }

//   async deleteTask(id: number): Promise<Task> {
//     return await this.prisma.task.delete({
//       where: {
//         id: id,
//       },
//     });
//   }
// }

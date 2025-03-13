import { Controller, Get } from '@nestjs/common';
import { ProductosService } from './productos.service';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  async obtenerProductos() {
    return this.productosService.getAllProducts();
  }
}
// EJEMPLO DE TASKS
// import { Task } from '@prisma/client';
// import { TaskService } from './task.service';

// @Controller('tasks')
// export class TaskController {
//   constructor(private readonly taskService: TaskService) {}

//   @Get(':id')
//   async getTaskById(@Param('id') id: string) {
//     const taskFound = await this.taskService.getTaskById(Number(id));
//     if (!taskFound) throw new BadRequestException('Task does not exist');
//     return taskFound;
//   }

//   @Post()
//   async createTask(@Body() data: Task) {
//     return this.taskService.createTask(data);
//   }

//   @Put(':id')
//   async updateTask(@Param('id') id: string, @Body() data: Task) {
//     try {
//       return await this.taskService.updateTask(Number(id), data);
//     } catch (error) {
//       console.error(error);
//       throw new BadRequestException('Task does not exist');
//     }
//   }

//   @Delete(':id')
//   async deleteTask(@Param('id') id: string) {
//     try {
//       return await this.taskService.deleteTask(Number(id));
//     } catch (error) {
//       console.error(error);
//       throw new BadRequestException('Task does not exist');
//     }
//   }
// }

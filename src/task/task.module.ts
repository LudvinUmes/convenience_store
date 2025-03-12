import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TaskService } from './task.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [PrismaModule],
})
export class TaskModule {}

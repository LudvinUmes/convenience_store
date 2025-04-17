import { Module } from '@nestjs/common';
import { RecetasService } from './recetas.service';
import { RecetasController } from './recetas.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [RecetasController],
  providers: [RecetasService, PrismaService],
})
export class RecetasModule {}

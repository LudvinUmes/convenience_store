import { Module } from '@nestjs/common';
import { RecetasService } from './recetas.service';
import { RecetasController } from './recetas.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [RecetasController],
  providers: [RecetasService],
  imports: [PrismaModule],
})
export class RecetasModule {}

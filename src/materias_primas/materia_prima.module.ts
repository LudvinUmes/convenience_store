import { Module } from '@nestjs/common';
import { MateriaPrimaService } from './materia_prima.service';
import { MateriaPrimaController } from './materia_prima.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [MateriaPrimaService],
  controllers: [MateriaPrimaController],
  imports: [PrismaModule],
  exports: [MateriaPrimaService]
})
export class MateriasPrimaModule {}
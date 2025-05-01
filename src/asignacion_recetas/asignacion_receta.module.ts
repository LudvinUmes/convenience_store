import { Module } from '@nestjs/common';
import { AsignacionRecetaService } from './asignacion_receta.service';
import { AsignacionRecetaController } from './asignacion_receta.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [AsignacionRecetaService],
  controllers: [AsignacionRecetaController],
  imports: [PrismaModule],
  exports: [AsignacionRecetaService]
})
export class AsignacionRecetaModule {}
import { Module } from '@nestjs/common';
import { lote_productosService } from './lotes.service';
import { Lote_productosController } from './lotes.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [lote_productosService],
  controllers: [Lote_productosController],
  imports: [PrismaModule],
})
export class Lote_productosModule {}

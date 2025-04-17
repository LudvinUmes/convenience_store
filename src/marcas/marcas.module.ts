import { Module } from '@nestjs/common';
import { marcasService } from './marca.service';
import { MarcasController } from './marcas.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [marcasService],
  controllers: [MarcasController],
  imports: [PrismaModule],
})
export class MarcasModule {}

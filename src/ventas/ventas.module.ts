import { Module } from '@nestjs/common';
import { VentasController } from './ventas.controller';
import { VentasService } from './ventas.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    controllers: [VentasController],
    providers: [VentasService],
    imports: [PrismaModule]
})
export class VentasModule {}

import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LotesController } from './lotes.controller';
import { LotesService } from './lotes.service';

@Module({
  providers: [LotesService],
  controllers: [LotesController],
  imports: [PrismaModule],
})
export class LotesModule {}

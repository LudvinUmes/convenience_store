import { Injectable } from '@nestjs/common';
import { ventas } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VentasService {
    constructor(private readonly prisma: PrismaService) {}
    
    async crearVentas(data: ventas): Promise<ventas> {
        return this.prisma.ventas.create({
            data
        });
    }

    async getAllVentas(): Promise<ventas[]>{
        return this.prisma.ventas.findMany({})
    }

    async getVentasbyId(id: number): Promise<ventas|null>{
        return this.prisma.ventas.findUnique({
            where: {
                id
            }
        })
    }
}


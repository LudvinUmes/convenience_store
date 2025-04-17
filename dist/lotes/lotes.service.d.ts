import { PrismaService } from '../prisma/prisma.service';
export declare class LoteService {
    private prisma;
    constructor(prisma: PrismaService);
    listar(): Promise<{
        id: number;
        descripcion: string | null;
        stock: number;
        usuario_creacion: number;
        fecha_creacion: Date;
        usuario_modificacion: number | null;
        fecha_modificacion: Date | null;
        estado: number;
        id_producto: number;
        costo_unitario: import("@prisma/client/runtime/library").Decimal;
        precio_lote: import("@prisma/client/runtime/library").Decimal;
        fecha_ingreso: Date;
        fecha_vencimiento: Date;
    }[]>;
    buscarPorId(id: number): Promise<{
        id: number;
        descripcion: string | null;
        stock: number;
        usuario_creacion: number;
        fecha_creacion: Date;
        usuario_modificacion: number | null;
        fecha_modificacion: Date | null;
        estado: number;
        id_producto: number;
        costo_unitario: import("@prisma/client/runtime/library").Decimal;
        precio_lote: import("@prisma/client/runtime/library").Decimal;
        fecha_ingreso: Date;
        fecha_vencimiento: Date;
    } | null>;
    crear(data: any): Promise<{
        id: number;
        descripcion: string | null;
        stock: number;
        usuario_creacion: number;
        fecha_creacion: Date;
        usuario_modificacion: number | null;
        fecha_modificacion: Date | null;
        estado: number;
        id_producto: number;
        costo_unitario: import("@prisma/client/runtime/library").Decimal;
        precio_lote: import("@prisma/client/runtime/library").Decimal;
        fecha_ingreso: Date;
        fecha_vencimiento: Date;
    }>;
    actualizar(id: number, data: any): Promise<{
        id: number;
        descripcion: string | null;
        stock: number;
        usuario_creacion: number;
        fecha_creacion: Date;
        usuario_modificacion: number | null;
        fecha_modificacion: Date | null;
        estado: number;
        id_producto: number;
        costo_unitario: import("@prisma/client/runtime/library").Decimal;
        precio_lote: import("@prisma/client/runtime/library").Decimal;
        fecha_ingreso: Date;
        fecha_vencimiento: Date;
    }>;
}

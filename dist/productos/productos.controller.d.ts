import { ProductosService } from './productos.service';
export declare class ProductosController {
    private readonly productosService;
    constructor(productosService: ProductosService);
    listar(esMateriaPrima?: string): Promise<({
        lote_productos: {
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
        }[];
        marcas: {
            id: number;
            nombre: string;
            usuario_creacion: number;
            fecha_creacion: Date;
            usuario_modificacion: number | null;
            fecha_modificacion: Date | null;
            estado: number;
        };
        recetas: {
            id: number;
            nombre: string;
            usuario_creacion: number;
            fecha_creacion: Date;
            usuario_modificacion: number | null;
            fecha_modificacion: Date | null;
            estado: number;
        };
        tipos_producto: {
            id: number;
            usuario_creacion: number;
            fecha_creacion: Date;
            usuario_modificacion: string | null;
            fecha_modificacion: Date | null;
            estado: number;
            name: string;
        };
    } & {
        id: number;
        nombre: string;
        descripcion: string | null;
        precio_referencia: import("@prisma/client/runtime/library").Decimal;
        unidad_medida: string;
        stock: number;
        stock_minimo: number;
        id_tipo: number;
        id_marca: number;
        es_materia_prima: boolean;
        usuario_creacion: number;
        fecha_creacion: Date;
        usuario_modificacion: number | null;
        fecha_modificacion: Date | null;
        estado: number;
        id_receta: number;
    })[]>;
    buscarPorId(id: number, esMateriaPrima?: string): Promise<({
        lote_productos: {
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
        }[];
        marcas: {
            id: number;
            nombre: string;
            usuario_creacion: number;
            fecha_creacion: Date;
            usuario_modificacion: number | null;
            fecha_modificacion: Date | null;
            estado: number;
        };
        recetas: {
            id: number;
            nombre: string;
            usuario_creacion: number;
            fecha_creacion: Date;
            usuario_modificacion: number | null;
            fecha_modificacion: Date | null;
            estado: number;
        };
        tipos_producto: {
            id: number;
            usuario_creacion: number;
            fecha_creacion: Date;
            usuario_modificacion: string | null;
            fecha_modificacion: Date | null;
            estado: number;
            name: string;
        };
    } & {
        id: number;
        nombre: string;
        descripcion: string | null;
        precio_referencia: import("@prisma/client/runtime/library").Decimal;
        unidad_medida: string;
        stock: number;
        stock_minimo: number;
        id_tipo: number;
        id_marca: number;
        es_materia_prima: boolean;
        usuario_creacion: number;
        fecha_creacion: Date;
        usuario_modificacion: number | null;
        fecha_modificacion: Date | null;
        estado: number;
        id_receta: number;
    }) | null>;
    crear(data: any): Promise<{
        id: number;
        nombre: string;
        descripcion: string | null;
        precio_referencia: import("@prisma/client/runtime/library").Decimal;
        unidad_medida: string;
        stock: number;
        stock_minimo: number;
        id_tipo: number;
        id_marca: number;
        es_materia_prima: boolean;
        usuario_creacion: number;
        fecha_creacion: Date;
        usuario_modificacion: number | null;
        fecha_modificacion: Date | null;
        estado: number;
        id_receta: number;
    }>;
    actualizar(id: number, data: any): Promise<{
        id: number;
        nombre: string;
        descripcion: string | null;
        precio_referencia: import("@prisma/client/runtime/library").Decimal;
        unidad_medida: string;
        stock: number;
        stock_minimo: number;
        id_tipo: number;
        id_marca: number;
        es_materia_prima: boolean;
        usuario_creacion: number;
        fecha_creacion: Date;
        usuario_modificacion: number | null;
        fecha_modificacion: Date | null;
        estado: number;
        id_receta: number;
    }>;
}

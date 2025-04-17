import { CategoriaService } from './categoria.service';
export declare class CategoriaController {
    private readonly categoriaService;
    constructor(categoriaService: CategoriaService);
    listar(): Promise<{
        id: number;
        usuario_creacion: number;
        fecha_creacion: Date;
        usuario_modificacion: string | null;
        fecha_modificacion: Date | null;
        estado: number;
        name: string;
    }[]>;
    buscarPorId(id: number): Promise<{
        id: number;
        usuario_creacion: number;
        fecha_creacion: Date;
        usuario_modificacion: string | null;
        fecha_modificacion: Date | null;
        estado: number;
        name: string;
    } | null>;
    crear(data: any): Promise<{
        id: number;
        usuario_creacion: number;
        fecha_creacion: Date;
        usuario_modificacion: string | null;
        fecha_modificacion: Date | null;
        estado: number;
        name: string;
    }>;
    actualizar(id: number, data: any): Promise<{
        id: number;
        usuario_creacion: number;
        fecha_creacion: Date;
        usuario_modificacion: string | null;
        fecha_modificacion: Date | null;
        estado: number;
        name: string;
    }>;
}

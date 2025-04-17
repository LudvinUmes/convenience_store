import { MarcasService } from './marcas.service';
export declare class MarcasController {
    private readonly marcasService;
    constructor(marcasService: MarcasService);
    listar(): Promise<{
        id: number;
        nombre: string;
        usuario_creacion: number;
        fecha_creacion: Date;
        usuario_modificacion: number | null;
        fecha_modificacion: Date | null;
        estado: number;
    }[]>;
    buscarPorId(id: number): Promise<{
        id: number;
        nombre: string;
        usuario_creacion: number;
        fecha_creacion: Date;
        usuario_modificacion: number | null;
        fecha_modificacion: Date | null;
        estado: number;
    } | null>;
    crear(data: any): Promise<{
        id: number;
        nombre: string;
        usuario_creacion: number;
        fecha_creacion: Date;
        usuario_modificacion: number | null;
        fecha_modificacion: Date | null;
        estado: number;
    }>;
    actualizar(id: number, data: any): Promise<{
        id: number;
        nombre: string;
        usuario_creacion: number;
        fecha_creacion: Date;
        usuario_modificacion: number | null;
        fecha_modificacion: Date | null;
        estado: number;
    }>;
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { productos, lote_productos, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

/**
 * Servicio que gestiona todas las operaciones relacionadas con el inventario.
 * Incluye funcionalidades para administrar productos, materia prima y reportes.
 */
@Injectable()
export class InventarioService {
    constructor(private readonly prisma: PrismaService) {}
    
    /**
     * Obtiene todos los productos del inventario con paginación.
     * 
     * @param pagina Número de página actual
     * @param porPagina Cantidad de elementos por página
     * @returns Lista de productos con información de paginación
     */
    async getProductos(pagina: number = 1, porPagina: number = 10) {
        const skip = (pagina - 1) * porPagina;
        const total = await this.prisma.productos.count({
            where: { estado: 1 }
        });
        
        const productos = await this.prisma.productos.findMany({
            where: { estado: 1 },
            include: {
                marcas: {
                    select: { nombre: true }
                },
                tipos_producto: {
                    select: { name: true }
                }
            },
            skip,
            take: porPagina
        });
        
        return {
            total,
            pagina,
            por_pagina: porPagina,
            productos: productos.map(p => ({
                ...p,
                marca: p.marcas.nombre,
                tipo: p.tipos_producto.name,
                marcas: undefined,
                tipos_producto: undefined
            }))
        };
    }
    
    /**
     * Obtiene un producto específico por su ID con sus lotes.
     * 
     * @param id ID del producto a buscar
     * @returns Producto con sus detalles completos y lotes asociados
     */
    async getProductoById(id: number) {
        const producto = await this.prisma.productos.findUnique({
            where: { id, estado: 1 },
            include: {
                marcas: {
                    select: { nombre: true }
                },
                tipos_producto: {
                    select: { name: true }
                },
                lote_productos: {
                    where: { estado: 1 },
                    select: {
                        id: true,
                        costo_unitario: true,
                        precio_lote: true,
                        stock: true,
                        fecha_ingreso: true,
                        fecha_vencimiento: true
                    }
                }
            }
        });
        
        if (!producto) {
            throw new NotFoundException('Producto no encontrado');
        }
        
        return {
            ...producto,
            marca: producto.marcas.nombre,
            tipo: producto.tipos_producto.name,
            marcas: undefined,
            tipos_producto: undefined,
            lotes: producto.lote_productos
        };
    }
    
    /**
     * Crea un nuevo producto en el inventario.
     * 
     * @param data Datos del producto a crear
     * @returns Producto creado con información adicional
     */
    async createProducto(data: Prisma.productosCreateInput) {
        const producto = await this.prisma.productos.create({
            data: {
                ...data,
                fecha_creacion: new Date(),
                estado: 1
            },
            include: {
                marcas: {
                    select: { nombre: true }
                },
                tipos_producto: {
                    select: { name: true }
                }
            }
        });
        
        return {
            ...producto,
            marca: producto.marcas.nombre,
            tipo: producto.tipos_producto.name,
            marcas: undefined,
            tipos_producto: undefined,
            mensaje: "Producto agregado correctamente"
        };
    }
    
    /**
     * Actualiza un producto existente.
     * 
     * @param id ID del producto a actualizar
     * @param data Nuevos datos del producto
     * @returns Producto actualizado con mensaje de confirmación
     */
    async updateProducto(id: number, data: Prisma.productosUpdateInput) {
        const producto = await this.prisma.productos.update({
            where: { id },
            data: {
                ...data,
                fecha_modificacion: new Date()
            },
            include: {
                marcas: {
                    select: { nombre: true }
                },
                tipos_producto: {
                    select: { name: true }
                }
            }
        });
        
        return {
            ...producto,
            marca: producto.marcas.nombre,
            tipo: producto.tipos_producto.name,
            marcas: undefined,
            tipos_producto: undefined,
            mensaje: "Producto actualizado correctamente"
        };
    }
    
    /**
     * Elimina lógicamente un producto (cambio de estado).
     * 
     * @param id ID del producto a eliminar
     * @returns Confirmación de la eliminación
     */
    async deleteProducto(id: number) {
        await this.prisma.productos.update({
            where: { id },
            data: {
                estado: 0,
                fecha_modificacion: new Date()
            }
        });
        
        return {
            id,
            mensaje: "Producto eliminado correctamente",
            estado: 0
        };
    }
    
    /**
     * Obtiene un reporte general del inventario.
     * 
     * @returns Reporte con estadísticas del inventario
     */
    async getReporteInventario() {
        // Obtener total de productos
        const totalProductos = await this.prisma.productos.count({
            where: { estado: 1 }
        });
        
        // Obtener total de materia prima
        const totalMateriaPrima = await this.prisma.productos.count({
            where: { estado: 1, es_materia_prima: true }
        });
        
        // Calcular valor total del inventario sumando (costo_unitario * stock) de todos los lotes
        const lotes = await this.prisma.lote_productos.findMany({
            where: { estado: 1 },
            select: {
                costo_unitario: true,
                stock: true
            }
        });
        
        const valorTotalInventario = lotes.reduce(
            (total, lote) => total + (Number(lote.costo_unitario) * lote.stock),
            0
        );
        
        // Obtener categorías con sus estadísticas
        const categorias = await this.prisma.categoria.findMany({
            where: { estado: 1 },
            select: {
                id: true,
                name: true,
                productos: {
                    where: { estado: 1 },
                    select: {
                        id: true,
                        lote_productos: {
                            where: { estado: 1 },
                            select: {
                                costo_unitario: true,
                                stock: true
                            }
                        }
                    }
                }
            }
        });
        
        const categoriasFormateadas = categorias.map(cat => {
            const cantidadProductos = cat.productos.length;
            const valorCategoria = cat.productos.reduce((total, prod) => {
                return total + prod.lote_productos.reduce(
                    (subtotal, lote) => subtotal + (Number(lote.costo_unitario) * lote.stock),
                    0
                );
            }, 0);
            
            return {
                id: cat.id,
                nombre: cat.name,
                cantidad_productos: cantidadProductos,
                valor_categoria: Number(valorCategoria.toFixed(2))
            };
        });
        
        // Obtener productos con stock crítico
        const productosCriticos = await this.prisma.$queryRaw`
            SELECT id, nombre, stock, stock_minimo
            FROM "productos"
            WHERE estado = 1 AND stock < stock_minimo
            LIMIT 10
        `;
        
        // Obtener productos próximos a vencer (en los próximos 7 días)
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() + 7);
        
        const lotesPorVencer = await this.prisma.lote_productos.findMany({
            where: {
                estado: 1,
                fecha_vencimiento: {
                    lte: fechaLimite
                },
                stock: {
                    gt: 0
                }
            },
            select: {
                id: true,
                fecha_vencimiento: true,
                productos: {
                    select: {
                        id: true,
                        nombre: true
                    }
                }
            },
            take: 10
        });
        
        const productosPorVencer = lotesPorVencer.map(lote => ({
            id: lote.productos.id,
            nombre: lote.productos.nombre,
            lote: `L${new Date().getFullYear()}-${lote.id}`,
            fecha_vencimiento: lote.fecha_vencimiento
        }));
        
        return {
            fecha_reporte: new Date(),
            total_productos: totalProductos,
            total_materia_prima: totalMateriaPrima,
            valor_total_inventario: Number(valorTotalInventario.toFixed(2)),
            categorias: categoriasFormateadas,
            productos_criticos: productosCriticos,
            productos_por_vencer: productosPorVencer
        };
    }
    
    /**
     * Obtiene productos de materia prima con paginación.
     * 
     * @param pagina Número de página actual
     * @param porPagina Cantidad de elementos por página
     * @returns Lista de materias primas con información de paginación
     */
    async getMateriaPrima(pagina: number = 1, porPagina: number = 10) {
        const skip = (pagina - 1) * porPagina;
        const total = await this.prisma.productos.count({
            where: { 
                estado: 1,
                es_materia_prima: true
            }
        });
        
        const materiasPrimas = await this.prisma.productos.findMany({
            where: { 
                estado: 1,
                es_materia_prima: true
            },
            include: {
                marcas: {
                    select: { nombre: true }
                },
                tipos_producto: {
                    select: { name: true }
                }
            },
            skip,
            take: porPagina
        });
        
        return {
            total,
            pagina,
            por_pagina: porPagina,
            materia_prima: materiasPrimas.map(p => ({
                ...p,
                marca: p.marcas.nombre,
                tipo: p.tipos_producto.name,
                marcas: undefined,
                tipos_producto: undefined
            }))
        };
    }
    
    /**
     * Crea una nueva materia prima en el inventario.
     * 
     * @param data Datos de la materia prima a crear
     * @returns Materia prima creada con información adicional
     */
    async createMateriaPrima(data: Prisma.productosCreateInput) {
        const materiaPrima = await this.prisma.productos.create({
            data: {
                ...data,
                es_materia_prima: true,
                fecha_creacion: new Date(),
                estado: 1
            },
            include: {
                marcas: {
                    select: { nombre: true }
                },
                tipos_producto: {
                    select: { name: true }
                }
            }
        });
        
        return {
            ...materiaPrima,
            marca: materiaPrima.marcas.nombre,
            tipo: materiaPrima.tipos_producto.name,
            marcas: undefined,
            tipos_producto: undefined,
            mensaje: "Materia prima agregada correctamente"
        };
    }
    
    /**
     * Actualiza una materia prima existente.
     * 
     * @param id ID de la materia prima a actualizar
     * @param data Nuevos datos de la materia prima
     * @returns Materia prima actualizada con mensaje de confirmación
     */
    async updateMateriaPrima(id: number, data: Prisma.productosUpdateInput) {
        const materiaPrima = await this.prisma.productos.update({
            where: { 
                id,
                es_materia_prima: true
            },
            data: {
                ...data,
                fecha_modificacion: new Date()
            },
            include: {
                marcas: {
                    select: { nombre: true }
                },
                tipos_producto: {
                    select: { name: true }
                }
            }
        });
        
        return {
            ...materiaPrima,
            marca: materiaPrima.marcas.nombre,
            tipo: materiaPrima.tipos_producto.name,
            marcas: undefined,
            tipos_producto: undefined,
            mensaje: "Materia prima actualizada correctamente"
        };
    }
    
    /**
     * Obtiene alertas de inventario bajo para productos regulares.
     * 
     * @returns Lista de productos con stock por debajo del mínimo
     */
    async getAlertasInventario() {
        // Usar consulta SQL directa
        const productosAlerta = await this.prisma.$queryRaw`
            SELECT p.id, p.nombre, p.stock, p.stock_minimo, p.precio_referencia, p.id_marca, m.nombre as marca_nombre
            FROM "productos" p
            JOIN "marcas" m ON p.id_marca = m.id
            WHERE p.estado = 1 AND p.es_materia_prima = false AND p.stock < p.stock_minimo
        `;
        
        return {
            fecha: new Date(),
            total_alertas: Array.isArray(productosAlerta) ? productosAlerta.length : 0,
            productos: Array.isArray(productosAlerta) ? productosAlerta.map(p => ({
                id: p.id,
                nombre: p.nombre,
                stock_actual: p.stock,
                stock_minimo: p.stock_minimo,
                diferencia: p.stock - p.stock_minimo,
                precio_referencia: p.precio_referencia,
                id_marca: p.id_marca,
                marca: p.marca_nombre || 'Sin marca'
            })) : []
        };
    }
    
    /**
     * Obtiene alertas de inventario bajo para materias primas.
     * 
     * @returns Lista de materias primas con stock por debajo del mínimo
     */
    async getAlertasMateriaPrima() {
        // Usar consulta SQL directa
        const materiaPrimaAlerta = await this.prisma.$queryRaw`
            SELECT p.id, p.nombre, p.stock, p.stock_minimo, p.unidad_medida, p.id_marca, m.nombre as marca_nombre
            FROM "productos" p
            JOIN "marcas" m ON p.id_marca = m.id
            WHERE p.estado = 1 AND p.es_materia_prima = true AND p.stock < p.stock_minimo
        `;
        
        return {
            fecha: new Date(),
            total_alertas: Array.isArray(materiaPrimaAlerta) ? materiaPrimaAlerta.length : 0,
            materia_prima: Array.isArray(materiaPrimaAlerta) ? materiaPrimaAlerta.map(p => ({
                id: p.id,
                nombre: p.nombre,
                stock_actual: p.stock,
                stock_minimo: p.stock_minimo,
                diferencia: p.stock - p.stock_minimo,
                unidad_medida: p.unidad_medida,
                id_marca: p.id_marca,
                marca: p.marca_nombre || 'Sin marca'
            })) : []
        };
    }
}
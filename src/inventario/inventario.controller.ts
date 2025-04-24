import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Query,
    ParseIntPipe,
  } from '@nestjs/common';
  import { InventarioService } from './inventario.service';
  import { productos as Productos, Prisma } from '@prisma/client';
  
  /**
   * Controlador para gestionar todas las operaciones relacionadas con el inventario.
   * Incluye endpoints para productos, materias primas, reportes y alertas.
   */
  @Controller()
  export class InventarioController {
    constructor(private readonly inventarioService: InventarioService) {}
  
    /**
     * Obtiene un listado paginado de todos los productos en inventario.
     * 
     * @param pagina Número de página a consultar
     * @param porPagina Cantidad de elementos por página
     * @returns Lista paginada de productos
     */
    @Get('inventario')
    async obtenerProductos(
      @Query('pagina') pagina: number = 1,
      @Query('por_pagina') porPagina: number = 10,
    ) {
      return await this.inventarioService.getProductos(pagina, porPagina);
    }
  
    /**
     * Obtiene un producto específico por su ID con sus lotes asociados.
     * 
     * @param id ID del producto a consultar
     * @returns Información detallada del producto
     */
    @Get('inventario/:id')
    async obtenerProductoPorId(
      @Param('id', ParseIntPipe) id: number,
    ) {
      return await this.inventarioService.getProductoById(id);
    }
  
    /**
     * Registra un nuevo producto en el inventario.
     * 
     * @param productoData Datos del producto a crear
     * @returns Producto creado con su ID asignado
     */
    @Post('inventario')
    async crearProducto(
      @Body() productoData: Prisma.productosCreateInput,
    ) {
      return await this.inventarioService.createProducto(productoData);
    }
  
    /**
     * Actualiza la información de un producto existente.
     * 
     * @param id ID del producto a modificar
     * @param productoData Nuevos datos del producto
     * @returns Producto actualizado
     */
    @Put('inventario/:id')
    async actualizarProducto(
      @Param('id', ParseIntPipe) id: number,
      @Body() productoData: Prisma.productosUpdateInput,
    ) {
      return await this.inventarioService.updateProducto(id, productoData);
    }
  
    /**
     * Elimina lógicamente un producto cambiando su estado a inactivo.
     * 
     * @param id ID del producto a eliminar
     * @returns Confirmación de la eliminación
     */
    @Delete('inventario/:id')
    async eliminarProducto(
      @Param('id', ParseIntPipe) id: number,
    ) {
      return await this.inventarioService.deleteProducto(id);
    }
  
    /**
     * Genera un reporte general del inventario con estadísticas y alertas.
     * 
     * @returns Reporte completo del estado del inventario
     */
    @Get('reportes/inventario')
    async obtenerReporteInventario() {
      return await this.inventarioService.getReporteInventario();
    }
  
    /**
     * Obtiene un listado paginado de todas las materias primas.
     * 
     * @param pagina Número de página a consultar
     * @param porPagina Cantidad de elementos por página
     * @returns Lista paginada de materias primas
     */
    @Get('materia_prima')
    async obtenerMateriasPrimas(
      @Query('pagina') pagina: number = 1,
      @Query('por_pagina') porPagina: number = 10,
    ) {
      return await this.inventarioService.getMateriaPrima(pagina, porPagina);
    }
  
    /**
     * Registra una nueva materia prima en el inventario.
     * 
     * @param materiaPrimaData Datos de la materia prima a crear
     * @returns Materia prima creada con su ID asignado
     */
    @Post('materia_prima')
    async crearMateriaPrima(
      @Body() materiaPrimaData: Prisma.productosCreateInput,
    ) {
      return await this.inventarioService.createMateriaPrima(materiaPrimaData);
    }
  
    /**
     * Actualiza la información de una materia prima existente.
     * 
     * @param id ID de la materia prima a modificar
     * @param materiaPrimaData Nuevos datos de la materia prima
     * @returns Materia prima actualizada
     */
    @Put('materia_prima/:id')
    async actualizarMateriaPrima(
      @Param('id', ParseIntPipe) id: number,
      @Body() materiaPrimaData: Prisma.productosUpdateInput,
    ) {
      return await this.inventarioService.updateMateriaPrima(id, materiaPrimaData);
    }
  
    /**
     * Obtiene alertas de productos regulares con stock por debajo del mínimo.
     * 
     * @returns Lista de productos con nivel crítico de inventario
     */
    @Get('alertas/inventario')
    async obtenerAlertasInventario() {
      return await this.inventarioService.getAlertasInventario();
    }
  
    /**
     * Obtiene alertas de materias primas con stock por debajo del mínimo.
     * 
     * @returns Lista de materias primas con nivel crítico de inventario
     */
    @Get('alertas/materia_prima')
    async obtenerAlertasMateriaPrima() {
      return await this.inventarioService.getAlertasMateriaPrima();
    }
  }
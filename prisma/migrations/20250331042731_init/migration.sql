/*
  Warnings:

  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Task";

-- CreateTable
CREATE TABLE "detalle_ventas" (
    "id" SERIAL NOT NULL,
    "id_venta" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(20,2) NOT NULL,
    "subtotal" DECIMAL(20,2) NOT NULL,
    "descuento" DECIMAL(20,2),
    "id_lote_producto" INTEGER NOT NULL,
    "usuario_creacion" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) NOT NULL,
    "usuario_modificacion" INTEGER,
    "fecha_modificacion" TIMESTAMP(6),
    "estado" SMALLINT NOT NULL,

    CONSTRAINT "detalle_ventas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devoluciones" (
    "id" SERIAL NOT NULL,
    "id_venta" INTEGER NOT NULL,
    "fecha_devolucion" TIMESTAMP(6) NOT NULL,
    "motivo" TEXT NOT NULL,
    "estado" VARCHAR(50) NOT NULL,
    "usuario_creacion" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) NOT NULL,
    "usuario_modificacion" INTEGER,
    "fecha_modificacion" TIMESTAMP(6),

    CONSTRAINT "devoluciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lote_productos" (
    "id" SERIAL NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "costo_unitario" DECIMAL(20,2) NOT NULL,
    "precio_lote" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL,
    "fecha_ingreso" TIMESTAMP(6) NOT NULL,
    "fecha_vencimiento" TIMESTAMP(6) NOT NULL,
    "descripcion" TEXT,
    "usuario_creacion" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) NOT NULL,
    "usuario_modificacion" INTEGER,
    "fecha_modificacion" TIMESTAMP(6),
    "estado" SMALLINT NOT NULL,

    CONSTRAINT "lote_productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marcas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "usuario_creacion" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) NOT NULL,
    "usuario_modificacion" INTEGER,
    "fecha_modificacion" TIMESTAMP(6),
    "estado" SMALLINT NOT NULL,

    CONSTRAINT "marcas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" SERIAL NOT NULL,
    "metodo_pago" VARCHAR(50) NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "id_venta" INTEGER NOT NULL,
    "usuario_creacion" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) NOT NULL,
    "usuario_modificacion" INTEGER,
    "fecha_modificacion" TIMESTAMP(6),
    "estado" SMALLINT NOT NULL,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(45) NOT NULL,
    "descripcion" TEXT,
    "precio_referencia" DECIMAL(20,18) NOT NULL,
    "unidad_medida" VARCHAR(45) NOT NULL,
    "stock_minimo" INTEGER NOT NULL,
    "id_tipo" INTEGER NOT NULL,
    "id_marca" INTEGER NOT NULL,
    "es_preparado" BOOLEAN NOT NULL,
    "usuario_creacion" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) NOT NULL,
    "usuario_modificacion" INTEGER,
    "fecha_modificacion" TIMESTAMP(6),
    "estado" SMALLINT NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_producto" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(45) NOT NULL,
    "usuario_creacion" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) NOT NULL,
    "usuario_modificacion" VARCHAR(45),
    "fecha_modificacion" TIMESTAMP(6),
    "estado" SMALLINT NOT NULL,

    CONSTRAINT "tipos_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ventas" (
    "id" SERIAL NOT NULL,
    "fecha_venta" TIMESTAMP(6) NOT NULL,
    "total" DECIMAL(20,2) NOT NULL,
    "estado_venta" VARCHAR(50) NOT NULL,
    "observaciones" TEXT,
    "nit" INTEGER,
    "nombre" VARCHAR(255),
    "usuario_creacion" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) NOT NULL,
    "usuario_modificacion" INTEGER,
    "fecha_modificacion" TIMESTAMP(6),
    "estado" SMALLINT NOT NULL,

    CONSTRAINT "ventas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asignacion_combos_productos" (
    "id" SERIAL NOT NULL,
    "id_combo" INTEGER NOT NULL,
    "id_lote_producto" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "asignacion_combos_productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combos" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "nombre" VARCHAR(45) NOT NULL,
    "precio_final" DECIMAL(20,2) NOT NULL,
    "usuario_creacion" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) NOT NULL,
    "usuario_modificacion" INTEGER,
    "fecha_modificacion" TIMESTAMP(6),
    "estado" SMALLINT NOT NULL,

    CONSTRAINT "combos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devoluciones_detalle" (
    "id_detalle" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "monto_reembolso" DECIMAL(10,2) NOT NULL,
    "id_devolucione" INTEGER NOT NULL,
    "id_detalle_venta" INTEGER NOT NULL,

    CONSTRAINT "devoluciones_detalle_pkey" PRIMARY KEY ("id_detalle")
);

-- CreateTable
CREATE TABLE "recetas" (
    "id" SERIAL NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "unidad_medida" VARCHAR(45) NOT NULL,
    "cantidad_requerida" INTEGER NOT NULL,
    "usuario_creacion" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) NOT NULL,
    "usuario_modificacion" INTEGER,
    "fecha_modificacion" TIMESTAMP(6),
    "estado" SMALLINT NOT NULL,

    CONSTRAINT "recetas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "detalle_ventas" ADD CONSTRAINT "fk_detalle_ventas_lote" FOREIGN KEY ("id_lote_producto") REFERENCES "lote_productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalle_ventas" ADD CONSTRAINT "fk_detalle_ventas_venta" FOREIGN KEY ("id_venta") REFERENCES "ventas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "devoluciones" ADD CONSTRAINT "fk_devoluciones_venta" FOREIGN KEY ("id_venta") REFERENCES "ventas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lote_productos" ADD CONSTRAINT "fk_lote_productos_productos" FOREIGN KEY ("id_producto") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "fk_pagos_venta" FOREIGN KEY ("id_venta") REFERENCES "ventas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "fk_productos_marcas" FOREIGN KEY ("id_marca") REFERENCES "marcas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "fk_productos_tipos" FOREIGN KEY ("id_tipo") REFERENCES "tipos_producto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "asignacion_combos_productos" ADD CONSTRAINT "fk_asignacion_combos_productos_prep_combos1" FOREIGN KEY ("id_combo") REFERENCES "combos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "asignacion_combos_productos" ADD CONSTRAINT "fk_asignacion_combos_productos_prep_lote_productos1" FOREIGN KEY ("id_lote_producto") REFERENCES "lote_productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "devoluciones_detalle" ADD CONSTRAINT "fk_devoluciones_detalle_detalle_ventas1" FOREIGN KEY ("id_detalle_venta") REFERENCES "detalle_ventas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "devoluciones_detalle" ADD CONSTRAINT "fk_devoluciones_detalle_devoluciones1" FOREIGN KEY ("id_devolucione") REFERENCES "devoluciones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "recetas" ADD CONSTRAINT "fk_asignacion_materias_primas_receta_productos1" FOREIGN KEY ("id_producto") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

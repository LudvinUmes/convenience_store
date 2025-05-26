/*
  Warnings:

  - You are about to drop the column `id_lote_producto` on the `asignacion_combos_productos` table. All the data in the column will be lost.
  - You are about to alter the column `precio_final` on the `combos` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,2)` to `Decimal(18,2)`.
  - You are about to alter the column `precio_unitario` on the `detalle_ventas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,2)` to `Decimal(18,2)`.
  - You are about to alter the column `subtotal` on the `detalle_ventas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,2)` to `Decimal(18,2)`.
  - You are about to alter the column `descuento` on the `detalle_ventas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,2)` to `Decimal(18,2)`.
  - The `estado` column on the `devoluciones` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `id_devolucione` on the `devoluciones_detalle` table. All the data in the column will be lost.
  - You are about to alter the column `costo_unitario` on the `lote_productos` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,2)` to `Decimal(18,2)`.
  - You are about to alter the column `metodo_pago` on the `pagos` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(20)`.
  - You are about to drop the column `es_preparado` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `id_tipo` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `unidad_medida` on the `productos` table. All the data in the column will be lost.
  - You are about to alter the column `total` on the `ventas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,2)` to `Decimal(18,2)`.
  - You are about to alter the column `estado_venta` on the `ventas` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(20)`.
  - You are about to drop the `recetas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tipos_producto` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nombre]` on the table `marcas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_producto` to the `asignacion_combos_productos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario_creacion` to the `asignacion_combos_productos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_producto` to the `detalle_ventas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado_devolucion` to the `devoluciones` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_devolucion` to the `devoluciones_detalle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario_creacion` to the `devoluciones_detalle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `es_materia_prima` to the `productos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_categoria` to the `productos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_unidad_medida` to the `productos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "tipo_producto_enum" AS ENUM ('FINAL', 'PREPARADO');

-- DropForeignKey
ALTER TABLE "asignacion_combos_productos" DROP CONSTRAINT "fk_asignacion_combos_productos_prep_lote_productos1";

-- DropForeignKey
ALTER TABLE "devoluciones_detalle" DROP CONSTRAINT "fk_devoluciones_detalle_devoluciones1";

-- DropForeignKey
ALTER TABLE "productos" DROP CONSTRAINT "fk_productos_tipos";

-- DropForeignKey
ALTER TABLE "recetas" DROP CONSTRAINT "fk_asignacion_materias_primas_receta_productos1";

-- AlterTable
ALTER TABLE "asignacion_combos_productos" DROP COLUMN "id_lote_producto",
ADD COLUMN     "estado" SMALLINT NOT NULL DEFAULT 1,
ADD COLUMN     "fecha_creacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fecha_modificacion" TIMESTAMP(6),
ADD COLUMN     "id_producto" INTEGER NOT NULL,
ADD COLUMN     "usuario_creacion" INTEGER NOT NULL,
ADD COLUMN     "usuario_modificacion" INTEGER;

-- AlterTable
ALTER TABLE "combos" ALTER COLUMN "precio_final" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "fecha_creacion" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "estado" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "detalle_ventas" ADD COLUMN     "id_combo" INTEGER,
ADD COLUMN     "id_producto" INTEGER NOT NULL,
ALTER COLUMN "precio_unitario" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "subtotal" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "descuento" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "id_lote_producto" DROP NOT NULL,
ALTER COLUMN "fecha_creacion" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "estado" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "devoluciones" ADD COLUMN     "estado_devolucion" VARCHAR(20) NOT NULL,
DROP COLUMN "estado",
ADD COLUMN     "estado" SMALLINT NOT NULL DEFAULT 1,
ALTER COLUMN "fecha_creacion" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "devoluciones_detalle" DROP COLUMN "id_devolucione",
ADD COLUMN     "estado" SMALLINT NOT NULL DEFAULT 1,
ADD COLUMN     "fecha_creacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fecha_modificacion" TIMESTAMP(6),
ADD COLUMN     "id_devolucion" INTEGER NOT NULL,
ADD COLUMN     "usuario_creacion" INTEGER NOT NULL,
ADD COLUMN     "usuario_modificacion" INTEGER;

-- AlterTable
ALTER TABLE "lote_productos" ALTER COLUMN "costo_unitario" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "fecha_creacion" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "estado" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "marcas" ALTER COLUMN "fecha_creacion" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "estado" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "pagos" ALTER COLUMN "metodo_pago" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "fecha_creacion" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "estado" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "productos" DROP COLUMN "es_preparado",
DROP COLUMN "id_tipo",
DROP COLUMN "unidad_medida",
ADD COLUMN     "es_materia_prima" BOOLEAN NOT NULL,
ADD COLUMN     "id_categoria" INTEGER NOT NULL,
ADD COLUMN     "id_unidad_medida" INTEGER NOT NULL,
ADD COLUMN     "receta" TEXT,
ADD COLUMN     "tipo" "tipo_producto_enum" NOT NULL DEFAULT 'FINAL',
ALTER COLUMN "id_marca" DROP NOT NULL,
ALTER COLUMN "fecha_creacion" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "estado" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "ventas" ALTER COLUMN "total" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "estado_venta" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "fecha_creacion" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "estado" SET DEFAULT 1;

-- DropTable
DROP TABLE "recetas";

-- DropTable
DROP TABLE "tipos_producto";

-- CreateTable
CREATE TABLE "alertas_stock" (
    "id" SERIAL NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "stock_actual" INTEGER NOT NULL,
    "stock_minimo" INTEGER NOT NULL,
    "fecha_alerta" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atendida" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "alertas_stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimientos_inventario" (
    "id" SERIAL NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "id_lote" INTEGER,
    "tipo_movimiento" VARCHAR(20) NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "descripcion" TEXT,
    "usuario_creacion" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_modificacion" INTEGER,
    "fecha_modificacion" TIMESTAMP(6),
    "estado" SMALLINT NOT NULL DEFAULT 1,

    CONSTRAINT "movimientos_inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(45) NOT NULL,
    "descripcion" TEXT,
    "usuario_creacion" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_modificacion" INTEGER,
    "fecha_modificacion" TIMESTAMP(6),
    "estado" SMALLINT NOT NULL DEFAULT 1,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asignacion_producto_preparado_materia_prima" (
    "id" SERIAL NOT NULL,
    "id_producto_preparado" INTEGER NOT NULL,
    "id_producto_materia_prima" INTEGER NOT NULL,
    "cantidad_requerida" INTEGER NOT NULL,
    "usuario_creacion" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) NOT NULL,
    "usuario_modificacion" INTEGER,
    "fecha_modificacion" TIMESTAMP(6),
    "estado" SMALLINT NOT NULL DEFAULT 1,

    CONSTRAINT "asignacion_producto_preparado_materia_prima_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidades_medida" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "abreviatura" VARCHAR(10) NOT NULL,
    "descripcion" TEXT,
    "estado" SMALLINT NOT NULL DEFAULT 1,
    "usuario_creacion" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_modificacion" INTEGER,
    "fecha_modificacion" TIMESTAMP(6),

    CONSTRAINT "unidades_medida_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unidades_medida_nombre_key" ON "unidades_medida"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "marcas_nombre_key" ON "marcas"("nombre");

-- AddForeignKey
ALTER TABLE "detalle_ventas" ADD CONSTRAINT "detalle_ventas_id_combo_fkey" FOREIGN KEY ("id_combo") REFERENCES "combos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "detalle_ventas" ADD CONSTRAINT "fk_detalle_ventas_productos1" FOREIGN KEY ("id_producto") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_id_unidad_medida_fkey" FOREIGN KEY ("id_unidad_medida") REFERENCES "unidades_medida"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "asignacion_combos_productos" ADD CONSTRAINT "fk_asignacion_combos_productos_productos1" FOREIGN KEY ("id_producto") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "devoluciones_detalle" ADD CONSTRAINT "devoluciones_detalle_id_devolucion_fkey" FOREIGN KEY ("id_devolucion") REFERENCES "devoluciones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "alertas_stock" ADD CONSTRAINT "alertas_stock_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_id_lote_fkey" FOREIGN KEY ("id_lote") REFERENCES "lote_productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "asignacion_producto_preparado_materia_prima" ADD CONSTRAINT "asignacion_producto_preparado_ma_id_producto_materia_prima_fkey" FOREIGN KEY ("id_producto_materia_prima") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "asignacion_producto_preparado_materia_prima" ADD CONSTRAINT "asignacion_producto_preparado_materi_id_producto_preparado_fkey" FOREIGN KEY ("id_producto_preparado") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

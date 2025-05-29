/*
  Warnings:

  - Added the required column `precio_unitario_descuento` to the `asignacion_combos_productos` table without a default value. This is not possible if the table is not empty.
  - Made the column `id_producto` on table `detalle_ventas` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "asignacion_combos_productos" ADD COLUMN     "precio_unitario_descuento" DECIMAL(18,2) NOT NULL;

-- AlterTable
ALTER TABLE "detalle_ventas" ALTER COLUMN "id_producto" SET NOT NULL;

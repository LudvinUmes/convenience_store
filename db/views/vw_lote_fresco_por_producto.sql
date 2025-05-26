CREATE OR REPLACE VIEW vw_lote_fresco_por_producto AS
SELECT DISTINCT ON (id_producto)
  id_producto,
  id,
  stock,
  fecha_ingreso
FROM lote_productos
WHERE estado = 1 AND stock > 0
ORDER BY id_producto, fecha_ingreso ASC;
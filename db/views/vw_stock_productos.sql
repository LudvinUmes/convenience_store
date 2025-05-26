CREATE OR REPLACE VIEW vw_stock_productos AS
SELECT
  p.id AS id_producto,
  p.nombre,
  SUM(lp.stock) AS stock_total
FROM productos p
LEFT JOIN lote_productos lp ON lp.id_producto = p.id AND lp.estado = 1
GROUP BY p.id, p.nombre;
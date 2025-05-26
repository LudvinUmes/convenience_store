CREATE OR REPLACE VIEW vw_productos_bajo_stock AS
SELECT
  p.id,
  p.nombre,
  COALESCE(SUM(lp.stock), 0) AS stock_actual,
  p.stock_minimo
FROM productos p
LEFT JOIN lote_productos lp ON lp.id_producto = p.id AND lp.estado = 1
GROUP BY p.id, p.nombre, p.stock_minimo
HAVING COALESCE(SUM(lp.stock), 0) < p.stock_minimo;

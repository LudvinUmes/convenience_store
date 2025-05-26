CREATE OR REPLACE FUNCTION fn_obtener_primer_lote_ingresado(idProducto INT)
RETURNS TABLE (
  id_lote INT,
  costo_unitario NUMERIC(20,2),
  precio_lote NUMERIC(10,2),
  stock INT,
  fecha_ingreso TIMESTAMP,
  fecha_vencimiento TIMESTAMP,
  descripcion TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    lp.id,
    lp.costo_unitario,
    lp.precio_lote,
    lp.stock,
    lp.fecha_ingreso,
    lp.fecha_vencimiento,
    lp.descripcion
  FROM lote_productos lp
  WHERE lp.id_producto = idProducto
    AND lp.estado = 1
    AND lp.stock > 0
  ORDER BY lp.fecha_ingreso ASC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

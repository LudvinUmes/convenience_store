CREATE OR REPLACE FUNCTION fn_validar_existencias(p_id_producto INT) 
RETURNS INT AS $$
DECLARE
  existencias INT;
BEGIN
  SELECT COALESCE(SUM(stock), 0)
  INTO existencias
  FROM public.lote_productos
  WHERE id_producto = p_id_producto AND estado = 1;

  RETURN existencias;
END;
$$ LANGUAGE plpgsql;
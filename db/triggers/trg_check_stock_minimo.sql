CREATE OR REPLACE FUNCTION public.fn_check_stock_minimo() RETURNS trigger AS $$
DECLARE
  stock_total INT;
  stock_minimo INT;
BEGIN
  -- Calcular el stock actual del producto (sumando lotes activos)
  SELECT COALESCE(SUM(stock), 0)
  INTO stock_total
  FROM lote_productos
  WHERE id_producto = NEW.id_producto
    AND estado = 1;

  -- Obtener el stock mínimo definido en la tabla productos
  SELECT p.stock_minimo
  INTO stock_minimo
  FROM productos p
  WHERE p.id = NEW.id_producto;

  -- Si el stock actual es menor que el mínimo, registrar la alerta
  IF stock_total < stock_minimo THEN
    INSERT INTO alertas_stock (id_producto, stock_actual, stock_minimo)
    VALUES (NEW.id_producto, stock_total, stock_minimo);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_stock_minimo
AFTER INSERT OR UPDATE ON public.lote_productos
FOR EACH ROW
EXECUTE FUNCTION public.fn_check_stock_minimo();

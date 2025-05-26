CREATE OR REPLACE FUNCTION descontar_stock_en_venta()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificamos si el stock actual es suficiente
  IF (SELECT stock FROM lote_productos WHERE id = NEW.id_lote_producto) < NEW.cantidad THEN
    RAISE EXCEPTION 'Stock insuficiente en el lote %', NEW.id_lote_producto;
  END IF;

  -- Descontamos la cantidad vendida del stock
  UPDATE lote_productos
  SET stock = stock - NEW.cantidad,
      fecha_modificacion = NOW(),
      usuario_modificacion = NEW.usuario_creacion
  WHERE id = NEW.id_lote_producto;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_descontar_stock_en_venta
AFTER INSERT ON detalle_ventas
FOR EACH ROW
EXECUTE FUNCTION descontar_stock_en_venta();

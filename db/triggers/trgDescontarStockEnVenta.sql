CREATE TRIGGER trg_descontar_stock_en_venta
AFTER INSERT ON detalle_ventas
FOR EACH ROW
EXECUTE FUNCTION descontar_stock_en_venta();

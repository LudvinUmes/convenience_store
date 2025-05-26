CREATE OR REPLACE FUNCTION public.fn_validar_producto_receta() RETURNS trigger AS $$
DECLARE
  tipo_producto tipo_producto_enum;
BEGIN
  IF(NEW.receta IS NOT NULL) THEN
    SELECT tipo INTO tipo_producto
    FROM productos
    WHERE id = NEW.id;

    IF tipo_producto IS DISTINCT FROM 'PREPARADO' THEN
      RAISE EXCEPTION 'Solo se pueden asignar recetas a productos tipo PREPARADO. Producto % es de tipo %.', NEW.id_producto_final, tipo_producto;
    END IF;

    RETURN NEW;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_producto_receta
BEFORE INSERT OR UPDATE ON public.productos
FOR EACH ROW
EXECUTE FUNCTION public.fn_validar_producto_receta();

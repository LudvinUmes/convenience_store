-- -----------------------------------------------------
-- Function obtenerTipoProducto
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION obtenerTipoProducto(p_id_producto INT) 
RETURNS TABLE(nombre_tipo TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT c.name::TEXT
    FROM public.productos p
    JOIN public.categoria c ON p.id_tipo = c.id
    WHERE p.id = p_id_producto;
    
    IF NOT FOUND THEN
        RAISE NOTICE 'No se encontró un tipo para el producto con ID %', p_id_producto;
        RETURN;
    END IF;
END;
$$ LANGUAGE plpgsql;
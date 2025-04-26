-- -----------------------------------------------------
-- Function existenteEnCombo
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION existenteEnCombo(p_id_producto INT) 
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.asignacion_combos_productos 
        WHERE id_producto = p_id_producto
    );
END;
$$ LANGUAGE plpgsql;
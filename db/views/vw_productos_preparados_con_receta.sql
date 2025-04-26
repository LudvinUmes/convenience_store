CREATE OR REPLACE VIEW public.vw_productos_preparados_con_receta AS
SELECT 
    p.nombre AS producto_preparado, 
    r.nombre AS receta
FROM 
    public.productos p
INNER JOIN 
    public.recetas r 
ON 
    p.id = r.id_producto_final
WHERE 
    p.es_materia_prima = FALSE;
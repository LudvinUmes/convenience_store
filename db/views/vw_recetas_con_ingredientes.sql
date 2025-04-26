CREATE OR REPLACE VIEW public.vw_recetas_con_ingredientes AS
SELECT 
    r.nombre AS receta,
    STRING_AGG(mp.nombre || ' (' || armp.cantidad_requerida || ' ' || armp.unidad_medida || ')', ', ') AS ingredientes
FROM 
    public.recetas r
INNER JOIN 
    public.asignacion_receta_materia_prima armp ON r.id = armp.id_receta
INNER JOIN 
    public.productos mp ON armp.id_producto = mp.id
GROUP BY 
    r.id, r.nombre;
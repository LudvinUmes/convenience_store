CREATE OR REPLACE VIEW public.vw_materias_primas AS
SELECT 
    nombre AS materia_prima,
    descripcion
FROM 
    public.productos
WHERE 
    es_materia_prima = TRUE;
CREATE OR REPLACE VIEW public.vw_combos_con_productos AS
SELECT 
    c.nombre AS combo,
    STRING_AGG(p.nombre || ' x' || acp.cantidad, ', ') AS productos
FROM 
    public.combos c
INNER JOIN 
    public.asignacion_combos_productos acp ON c.id = acp.id_combo
INNER JOIN 
    public.productos p ON acp.id_producto = p.id
GROUP BY 
    c.id, c.nombre;

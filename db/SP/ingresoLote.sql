CREATE OR REPLACE PROCEDURE ingreso_lote(
  p_id_producto INT,
  p_costo_unitario NUMERIC(20,2),
  p_precio_lote NUMERIC(10,2),
  p_stock INT,
  p_fecha_ingreso TIMESTAMP,
  p_fecha_vencimiento TIMESTAMP,
  p_descripcion TEXT,
  p_usuario_creacion INT
)
LANGUAGE plpgsql
AS $$
BEGIN
  -- Validamos que el producto exista y esté activo
  IF NOT EXISTS (
    SELECT 1 FROM productos
    WHERE id = p_id_producto AND estado = 1
  ) THEN
    RAISE EXCEPTION 'El producto con ID % no existe o está inactivo.', p_id_producto;
  END IF;

  -- Insertamos el nuevo lote
  INSERT INTO lote_productos (
    id_producto,
    costo_unitario,
    precio_lote,
    stock,
    fecha_ingreso,
    fecha_vencimiento,
    descripcion,
    usuario_creacion,
    fecha_creacion,
    estado
  )
  VALUES (
    p_id_producto,
    p_costo_unitario,
    p_precio_lote,
    p_stock,
    p_fecha_ingreso,
    p_fecha_vencimiento,
    p_descripcion,
    p_usuario_creacion,
    NOW(),
    1  -- activo
  );
END;
$$;

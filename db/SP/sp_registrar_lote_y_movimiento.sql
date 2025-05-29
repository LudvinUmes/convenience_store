CREATE OR REPLACE PROCEDURE sp_registrar_lote_y_movimiento(
    p_id_producto INT,
    p_costo_unitario DECIMAL,
    p_precio_lote DECIMAL,
    p_stock INT,
    p_fecha_ingreso TIMESTAMP,
    p_fecha_vencimiento TIMESTAMP,
    p_descripcion TEXT,
    p_usuario_creacion INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    nuevo_lote_id INT;
BEGIN
    INSERT INTO lote_productos (
        id_producto, costo_unitario, precio_lote, stock,
        fecha_ingreso, fecha_vencimiento, descripcion,
        usuario_creacion, fecha_creacion, estado
    ) VALUES (
        p_id_producto, p_costo_unitario, p_precio_lote, p_stock,
        p_fecha_ingreso, p_fecha_vencimiento, p_descripcion,
        p_usuario_creacion, NOW(), 1
    )
    RETURNING id INTO nuevo_lote_id;

    INSERT INTO movimientos_inventario (
        id_producto, id_lote, tipo_movimiento, cantidad,
        descripcion, usuario_creacion, fecha_creacion, estado
    ) VALUES (
        p_id_producto, nuevo_lote_id, 'ENTRADA', p_stock,
        'Ingreso por nuevo lote', p_usuario_creacion, NOW(), 1
    );
END;
$$;
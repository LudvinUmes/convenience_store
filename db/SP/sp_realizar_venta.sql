CREATE OR REPLACE PROCEDURE sp_realizar_venta(
  p_fecha_venta TIMESTAMP,
  p_total DECIMAL(18,2),
  p_observaciones TEXT,
  p_nit INT,
  p_nombre VARCHAR(255),
  p_usuario_creacion INT,
  p_metodo_pago VARCHAR(20),
  p_detalle_ventas JSON
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_id_venta INT;
  v_item JSON;
  v_id_producto INT;
  v_cantidad INT;
  v_precio_unitario DECIMAL(18,2);
  v_subtotal DECIMAL(18,2);
  v_existencias INT;
  v_id_lote INT;
  v_stock_lote INT;
  v_cantidad_pendiente INT;
BEGIN
  -- Comenzar una transacción
  BEGIN
    -- Insertar la venta principal
    INSERT INTO public.ventas(
      fecha_venta, 
      total, 
      estado_venta, 
      observaciones, 
      nit, 
      nombre, 
      usuario_creacion, 
      fecha_creacion, 
      estado
    )
    VALUES(
      p_fecha_venta, 
      p_total, 
      'pendiente', 
      p_observaciones, 
      p_nit, 
      p_nombre, 
      p_usuario_creacion, 
      NOW(), 
      1
    )
    RETURNING id INTO v_id_venta;
    
    -- Procesar cada ítem del detalle de ventas
    FOR v_item IN SELECT json_array_elements(p_detalle_ventas)
    LOOP
      v_id_producto := (v_item->>'id_producto')::INT;
      v_cantidad := (v_item->>'cantidad')::INT;
      v_precio_unitario := (v_item->>'precio_unitario')::DECIMAL(18,2);
      v_subtotal := (v_item->>'subtotal')::DECIMAL(18,2);
      
      -- Validar existencias del producto
      v_existencias := validarExistencias(v_id_producto);
      
      IF v_existencias < v_cantidad THEN
        RAISE EXCEPTION 'No hay suficientes existencias para el producto ID: %', v_id_producto;
      END IF;
      
      -- Cantidad pendiente por asignar
      v_cantidad_pendiente := v_cantidad;
      
      -- Buscar los lotes disponibles ordenados por fecha de vencimiento (FIFO)
      FOR v_id_lote, v_stock_lote IN 
        SELECT id, stock 
        FROM public.lote_productos 
        WHERE id_producto = v_id_producto 
        AND stock > 0 
        AND estado = 1 
        ORDER BY fecha_vencimiento ASC
      LOOP
        -- Determinar cuánto tomar de este lote
        IF v_stock_lote >= v_cantidad_pendiente THEN
          -- Este lote cubre toda la cantidad pendiente
          
          -- Insertar detalle de venta
          INSERT INTO public.detalle_ventas(
            id_venta, 
            cantidad, 
            precio_unitario, 
            subtotal, 
            id_producto, 
            id_lote_producto, 
            usuario_creacion, 
            fecha_creacion, 
            estado
          )
          VALUES (
            v_id_venta, 
            v_cantidad_pendiente, 
            v_precio_unitario, 
            v_precio_unitario * v_cantidad_pendiente, 
            v_id_producto, 
            v_id_lote, 
            p_usuario_creacion, 
            NOW(), 
            1
          );
          
          -- Actualizar stock en el lote
          UPDATE public.lote_productos 
          SET stock = stock - v_cantidad_pendiente 
          WHERE id = v_id_lote;
          
          -- Actualizar stock en productos
          UPDATE public.productos 
          SET stock = stock - v_cantidad_pendiente 
          WHERE id = v_id_producto;
          
          -- Salir del bucle ya que hemos satisfecho la cantidad
          v_cantidad_pendiente := 0;
          EXIT;
        ELSE
          -- Este lote cubre parcialmente la cantidad pendiente
          
          -- Insertar detalle de venta con la cantidad disponible en este lote
          INSERT INTO public.detalle_ventas(
            id_venta, 
            cantidad, 
            precio_unitario, 
            subtotal, 
            id_producto, 
            id_lote_producto, 
            usuario_creacion, 
            fecha_creacion, 
            estado
          )
          VALUES (
            v_id_venta, 
            v_stock_lote, 
            v_precio_unitario, 
            v_precio_unitario * v_stock_lote, 
            v_id_producto, 
            v_id_lote, 
            p_usuario_creacion, 
            NOW(), 
            1
          );
          
          -- Actualizar stock en el lote (quedará en 0)
          UPDATE public.lote_productos 
          SET stock = 0 
          WHERE id = v_id_lote;
          
          -- Actualizar cantidad pendiente
          v_cantidad_pendiente := v_cantidad_pendiente - v_stock_lote;
          
          -- Actualizar stock en productos
          UPDATE public.productos 
          SET stock = stock - v_stock_lote 
          WHERE id = v_id_producto;
        END IF;
        
        -- Si ya no hay cantidad pendiente, salir del bucle
        IF v_cantidad_pendiente = 0 THEN
          EXIT;
        END IF;
      END LOOP;
      
      -- Verificar si quedó alguna cantidad pendiente sin asignar a lotes
      IF v_cantidad_pendiente > 0 THEN
        RAISE EXCEPTION 'Error al asignar lotes para el producto ID: %', v_id_producto;
      END IF;
    END LOOP;
    
    -- Registrar el pago
    INSERT INTO public.pagos(
      metodo_pago, 
      monto, 
      id_venta, 
      usuario_creacion, 
      fecha_creacion, 
      estado
    )
    VALUES(
      p_metodo_pago, 
      p_total, 
      v_id_venta, 
      p_usuario_creacion, 
      NOW(), 
      1
    );
    
    -- Actualizar el estado de la venta a pagado
    UPDATE public.ventas 
    SET estado_venta = 'pagado' 
    WHERE id = v_id_venta;
    
    -- Confirmar la transacción
    COMMIT;
    
  EXCEPTION WHEN OTHERS THEN
    -- En caso de error, revertir la transacción
    ROLLBACK;
    RAISE;
  END;
END;
$$; 
CREATE OR REPLACE FUNCTION public.fn_check_stock_minimo() RETURNS trigger AS $$
DECLARE
  stock_total INT;
  stock_minimo INT;
BEGIN
  -- Calcular el stock actual del producto (sumando lotes activos)
  SELECT COALESCE(SUM(stock), 0)
  INTO stock_total
  FROM lote_productos
  WHERE id_producto = NEW.id_producto
    AND estado = 1;

  -- Obtener el stock mínimo definido en la tabla productos
  SELECT p.stock_minimo
  INTO stock_minimo
  FROM productos p
  WHERE p.id = NEW.id_producto;

  -- Si el stock actual es menor que el mínimo, registrar la alerta
  IF stock_total < stock_minimo THEN
    INSERT INTO alertas_stock (id_producto, stock_actual, stock_minimo)
    VALUES (NEW.id_producto, stock_total, stock_minimo);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_stock_minimo
AFTER INSERT OR UPDATE ON public.lote_productos
FOR EACH ROW
EXECUTE FUNCTION public.fn_check_stock_minimo();

-- 

CREATE OR REPLACE FUNCTION descontar_stock_en_venta()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificamos si el stock actual es suficiente
  IF (SELECT stock FROM lote_productos WHERE id = NEW.id_lote_producto) < NEW.cantidad THEN
    RAISE EXCEPTION 'Stock insuficiente en el lote %', NEW.id_lote_producto;
  END IF;

  -- Descontamos la cantidad vendida del stock
  UPDATE lote_productos
  SET stock = stock - NEW.cantidad,
      fecha_modificacion = NOW(),
      usuario_modificacion = NEW.usuario_creacion
  WHERE id = NEW.id_lote_producto;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_descontar_stock_en_venta
AFTER INSERT ON detalle_ventas
FOR EACH ROW
EXECUTE FUNCTION descontar_stock_en_venta();

--

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

CREATE OR REPLACE PROCEDURE sp_registrar_venta_completa(
  p_estado_venta VARCHAR,
  p_observaciones TEXT,
  p_nit VARCHAR,
  p_nombre TEXT,
  p_usuario_creacion INT,
  p_detalles JSONB,
  p_pagos JSONB
)
LANGUAGE plpgsql
AS $$
DECLARE
  nueva_venta_id INT;
  detalle RECORD;
  pago RECORD;
  lote RECORD;
  producto_combo RECORD;
  cantidad_total_necesaria INT;
  cantidad_restante INT;
  tipo_producto tipo_producto_enum;
  materia_prima RECORD;
  stock_materia_prima INT;
  cantidad_necesaria_mp INT;
  subtotal_producto DECIMAL;
  total_venta DECIMAL := 0;
  precio_unitario DECIMAL;
BEGIN
  -- Insertar venta
  INSERT INTO ventas (
    fecha_venta, total, estado_venta, observaciones,
    nit, nombre, usuario_creacion, fecha_creacion, estado
  ) VALUES (
    NOW(), 0, p_estado_venta, p_observaciones,
    p_nit, p_nombre, p_usuario_creacion, NOW(), 1
  ) RETURNING id INTO nueva_venta_id;

  -- Procesar detalles
  FOR detalle IN SELECT * FROM jsonb_to_recordset(p_detalles)
    AS x(id_producto INT, id_combo INT, cantidad INT)
  LOOP
    IF detalle.id_combo IS NOT NULL THEN
      FOR producto_combo IN
        SELECT acp.id_producto, acp.precio_unitario_descuento, acp.cantidad, p.tipo
        FROM asignacion_combos_productos acp
        JOIN productos p ON acp.id_producto = p.id
        WHERE acp.id_combo = detalle.id_combo AND acp.estado = 1
      LOOP
        cantidad_total_necesaria := producto_combo.cantidad * detalle.cantidad;
        subtotal_producto := cantidad_total_necesaria * producto_combo.precio_unitario_descuento;
		total_venta := total_venta + subtotal_producto;

        IF producto_combo.tipo = 'FINAL' THEN
          cantidad_restante := cantidad_total_necesaria;

          FOR lote IN
            SELECT * FROM lote_productos
            WHERE id_producto = producto_combo.id_producto AND stock > 0 AND estado = 1
            ORDER BY fecha_ingreso ASC
          LOOP
            EXIT WHEN cantidad_restante <= 0;

            IF lote.stock >= cantidad_restante THEN
              INSERT INTO detalle_ventas (
                id_venta, id_producto, id_combo, cantidad, precio_unitario,
                subtotal, id_lote_producto, usuario_creacion, fecha_creacion, estado
              ) VALUES (
                nueva_venta_id, producto_combo.id_producto, detalle.id_combo,
                cantidad_restante, producto_combo.precio_unitario_descuento,
                cantidad_restante * producto_combo.precio_unitario_descuento,
                lote.id, p_usuario_creacion, NOW(), 1
              );

              INSERT INTO movimientos_inventario (
                id_producto, id_lote, tipo_movimiento, cantidad,
                descripcion, usuario_creacion, fecha_creacion, estado
              ) VALUES (
                producto_combo.id_producto, lote.id, 'SALIDA', cantidad_restante,
                'Venta por combo - ID: ' || detalle.id_combo,
                p_usuario_creacion, NOW(), 1
              );

              cantidad_restante := 0;
            ELSE
              INSERT INTO detalle_ventas (
                id_venta, id_producto, id_combo, cantidad, precio_unitario,
                subtotal, id_lote_producto, usuario_creacion, fecha_creacion, estado
              ) VALUES (
                nueva_venta_id, producto_combo.id_producto, detalle.id_combo,
                lote.stock, producto_combo.precio_unitario_descuento,
                lote.stock * producto_combo.precio_unitario_descuento,
                lote.id, p_usuario_creacion, NOW(), 1
              );

              INSERT INTO movimientos_inventario (
                id_producto, id_lote, tipo_movimiento, cantidad,
                descripcion, usuario_creacion, fecha_creacion, estado
              ) VALUES (
                producto_combo.id_producto, lote.id, 'SALIDA', lote.stock,
                'Venta por combo - ID: ' || detalle.id_combo,
                p_usuario_creacion, NOW(), 1
              );

              cantidad_restante := cantidad_restante - lote.stock;
            END IF;
          END LOOP;

        ELSIF producto_combo.tipo = 'PREPARADO' THEN
          FOR materia_prima IN
            SELECT id_producto_materia_prima, cantidad_requerida
            FROM asignacion_producto_preparado_materia_prima
            WHERE id_producto_preparado = producto_combo.id_producto AND estado = 1
          LOOP
            cantidad_necesaria_mp := materia_prima.cantidad_requerida * cantidad_total_necesaria;

            SELECT COALESCE(SUM(stock), 0) INTO stock_materia_prima
            FROM lote_productos
            WHERE id_producto = materia_prima.id_producto_materia_prima AND stock > 0 AND estado = 1;

            IF stock_materia_prima < cantidad_necesaria_mp THEN
              RAISE EXCEPTION 'Stock insuficiente para la materia prima ID %. Disponible: %, Necesario: %', 
                materia_prima.id_producto_materia_prima, stock_materia_prima, cantidad_necesaria_mp;
            END IF;

            cantidad_restante := cantidad_necesaria_mp;

            FOR lote IN
              SELECT * FROM lote_productos
              WHERE id_producto = materia_prima.id_producto_materia_prima AND stock > 0 AND estado = 1
              ORDER BY fecha_ingreso ASC
            LOOP
              EXIT WHEN cantidad_restante <= 0;

              IF lote.stock >= cantidad_restante THEN
                UPDATE lote_productos
                SET stock = stock - cantidad_restante,
                    fecha_modificacion = NOW(),
                    usuario_modificacion = p_usuario_creacion
                WHERE id = lote.id;

                INSERT INTO movimientos_inventario (
                  id_producto, id_lote, tipo_movimiento, cantidad,
                  descripcion, usuario_creacion, fecha_creacion, estado
                ) VALUES (
                  materia_prima.id_producto_materia_prima, lote.id, 'SALIDA', cantidad_restante,
                  'Consumo por producto preparado en combo - Producto: ' || producto_combo.id_producto,
                  p_usuario_creacion, NOW(), 1
                );

                cantidad_restante := 0;
              ELSE
                UPDATE lote_productos
                SET stock = 0,
                    fecha_modificacion = NOW(),
                    usuario_modificacion = p_usuario_creacion
                WHERE id = lote.id;

                INSERT INTO movimientos_inventario (
                  id_producto, id_lote, tipo_movimiento, cantidad,
                  descripcion, usuario_creacion, fecha_creacion, estado
                ) VALUES (
                  materia_prima.id_producto_materia_prima, lote.id, 'SALIDA', lote.stock,
                  'Consumo por producto preparado en combo - Producto: ' || producto_combo.id_producto,
                  p_usuario_creacion, NOW(), 1
                );

                cantidad_restante := cantidad_restante - lote.stock;
              END IF;
            END LOOP;
          END LOOP;

          INSERT INTO detalle_ventas (
            id_venta, id_producto, id_combo, cantidad, precio_unitario,
            subtotal, usuario_creacion, fecha_creacion, estado
          ) VALUES (
            nueva_venta_id, producto_combo.id_producto, detalle.id_combo,
            cantidad_total_necesaria, producto_combo.precio_unitario_descuento,
            subtotal_producto, p_usuario_creacion, NOW(), 1
          );

        ELSE
          RAISE EXCEPTION 'Tipo de producto no válido: %', producto_combo.tipo;
        END IF;
      END LOOP;

    ELSE -- Si es producto individual
      SELECT tipo, precio_referencia INTO tipo_producto, precio_unitario
      FROM productos
      WHERE id = detalle.id_producto;

	  subtotal_producto := detalle.cantidad * precio_unitario;
      total_venta := total_venta + subtotal_producto;

      IF tipo_producto = 'FINAL' THEN
        cantidad_restante := detalle.cantidad;

        FOR lote IN
          SELECT * FROM lote_productos
          WHERE id_producto = detalle.id_producto AND stock > 0 AND estado = 1
          ORDER BY fecha_ingreso ASC
        LOOP
          EXIT WHEN cantidad_restante <= 0;

          IF lote.stock >= cantidad_restante THEN
            INSERT INTO detalle_ventas (
              id_venta, id_producto, cantidad, precio_unitario,
              subtotal, id_lote_producto, usuario_creacion, fecha_creacion, estado
            ) VALUES (
              nueva_venta_id, detalle.id_producto, cantidad_restante, precio_unitario,
              cantidad_restante * precio_unitario, lote.id,
              p_usuario_creacion, NOW(), 1
            );

            INSERT INTO movimientos_inventario (
              id_producto, id_lote, tipo_movimiento, cantidad,
              descripcion, usuario_creacion, fecha_creacion, estado
            ) VALUES (
              detalle.id_producto, lote.id, 'SALIDA', cantidad_restante,
              'Venta directa', p_usuario_creacion, NOW(), 1
            );

            cantidad_restante := 0;
          ELSE
            INSERT INTO detalle_ventas (
              id_venta, id_producto, cantidad, precio_unitario,
              subtotal, id_lote_producto, usuario_creacion, fecha_creacion, estado
            ) VALUES (
              nueva_venta_id, detalle.id_producto, lote.stock, precio_unitario,
              lote.stock * precio_unitario, lote.id,
              p_usuario_creacion, NOW(), 1
            );

            INSERT INTO movimientos_inventario (
              id_producto, id_lote, tipo_movimiento, cantidad,
              descripcion, usuario_creacion, fecha_creacion, estado
            ) VALUES (
              detalle.id_producto, lote.id, 'SALIDA', lote.stock,
              'Venta directa', p_usuario_creacion, NOW(), 1
            );

            cantidad_restante := cantidad_restante - lote.stock;
          END IF;
        END LOOP;

      ELSIF tipo_producto = 'PREPARADO' THEN
		FOR materia_prima IN
			SELECT id_producto_materia_prima, cantidad_requerida
		    FROM asignacion_producto_preparado_materia_prima
		    WHERE id_producto_preparado = detalle.id_producto AND estado = 1
		LOOP
		    cantidad_necesaria_mp := materia_prima.cantidad_requerida * detalle.cantidad;
		
		    SELECT COALESCE(SUM(stock), 0) INTO stock_materia_prima
		    FROM lote_productos
		    WHERE id_producto = materia_prima.id_producto_materia_prima AND stock > 0 AND estado = 1;
		
		    IF stock_materia_prima < cantidad_necesaria_mp THEN
		      RAISE EXCEPTION 'Stock insuficiente para materia prima ID %. Disponible: %, Necesario: %',
		        materia_prima.id_producto_materia_prima, stock_materia_prima, cantidad_necesaria_mp;
		    END IF;
		
		    cantidad_restante := cantidad_necesaria_mp;
		
		    FOR lote IN
		      SELECT * FROM lote_productos
		      WHERE id_producto = materia_prima.id_producto_materia_prima AND stock > 0 AND estado = 1
		      ORDER BY fecha_ingreso ASC
		    LOOP
		      EXIT WHEN cantidad_restante <= 0;
		
		      IF lote.stock >= cantidad_restante THEN
		        UPDATE lote_productos
		        SET stock = stock - cantidad_restante,
		            fecha_modificacion = NOW(),
		            usuario_modificacion = p_usuario_creacion
		        WHERE id = lote.id;
		
		        INSERT INTO movimientos_inventario (
		          id_producto, id_lote, tipo_movimiento, cantidad,
		          descripcion, usuario_creacion, fecha_creacion, estado
		        ) VALUES (
		          materia_prima.id_producto_materia_prima, lote.id, 'SALIDA', cantidad_restante,
		          'Consumo por producto preparado individual - Producto: ' || detalle.id_producto,
		          p_usuario_creacion, NOW(), 1
		        );
		
		        cantidad_restante := 0;
		      ELSE
		        UPDATE lote_productos
		        SET stock = 0,
		            fecha_modificacion = NOW(),
		            usuario_modificacion = p_usuario_creacion
		        WHERE id = lote.id;
		
		        INSERT INTO movimientos_inventario (
		          id_producto, id_lote, tipo_movimiento, cantidad,
		          descripcion, usuario_creacion, fecha_creacion, estado
		        ) VALUES (
		          materia_prima.id_producto_materia_prima, lote.id, 'SALIDA', lote.stock,
		          'Consumo por producto preparado individual - Producto: ' || detalle.id_producto,
		          p_usuario_creacion, NOW(), 1
		        );
		
		        cantidad_restante := cantidad_restante - lote.stock;
		      END IF;
		    END LOOP;
		  END LOOP;
		
		  INSERT INTO detalle_ventas (
		    id_venta, id_producto, cantidad, precio_unitario,
		    subtotal, usuario_creacion, fecha_creacion, estado
		  ) VALUES (
		    nueva_venta_id, detalle.id_producto, detalle.cantidad, precio_unitario,
		    detalle.cantidad * precio_unitario, p_usuario_creacion, NOW(), 1
		  );
      END IF;
    END IF;
  END LOOP;

  -- Actualizar total final
  UPDATE ventas SET total = total_venta WHERE id = nueva_venta_id;
  
  -- Procesar pagos
  FOR pago IN SELECT * FROM jsonb_to_recordset(p_pagos)
    AS x(metodo_pago TEXT, monto DECIMAL)
  LOOP
    INSERT INTO pagos (
      metodo_pago, monto, id_venta,
      usuario_creacion, fecha_creacion, estado
    ) VALUES (
      pago.metodo_pago, pago.monto, nueva_venta_id,
      p_usuario_creacion, NOW(), 1
    );
  END LOOP;
END;
$$;

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
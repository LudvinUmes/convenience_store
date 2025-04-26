
-- -----------------------------------------------------
-- Table public.marcas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marcas (
  id SERIAL NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  usuario_modificacion INT NULL,
  fecha_modificacion TIMESTAMP NULL,
  estado SMALLINT NOT NULL,
  PRIMARY KEY (id));

-- -----------------------------------------------------
-- Table public.categoria
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categoria (
  id INT NOT NULL,
  name VARCHAR(45) NOT NULL,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  usuario_modificacion VARCHAR(45) NULL,
  fecha_modificacion TIMESTAMP NULL,
  estado SMALLINT NOT NULL,
  PRIMARY KEY (id));

-- -----------------------------------------------------
-- Table public.recetas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recetas (
  id SERIAL NOT NULL,
  nombre VARCHAR(45) NOT NULL,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  usuario_modificacion INT NULL,
  fecha_modificacion TIMESTAMP NULL,  
  estado SMALLINT NOT NULL,
  id_producto_final INT NOT NULL,
  PRIMARY KEY (id)
);

-- -----------------------------------------------------
-- Table public.productos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.productos (
  id SERIAL NOT NULL,
  nombre VARCHAR(45) NOT NULL,
  descripcion TEXT NULL,
  precio_referencia DECIMAL(20,18) NOT NULL,
  unidad_medida VARCHAR(45) NOT NULL,
  stock INT NOT NULL,
  stock_minimo INT NOT NULL,
  id_tipo INT NOT NULL,
  id_marca INT NOT NULL,
  es_materia_prima BOOLEAN NOT NULL,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  usuario_modificacion INT NULL,
  fecha_modificacion TIMESTAMP NULL,
  estado SMALLINT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_productos_tipos_producto1
    FOREIGN KEY (id_tipo)
    REFERENCES public.categoria (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_productos_marcas1
    FOREIGN KEY (id_marca)
    REFERENCES public.marcas (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
  );

CREATE INDEX fk_productos_tipos_producto1_idx ON public.productos (id_tipo ASC);
CREATE INDEX fk_productos_marcas1_idx ON public.productos (id_marca ASC);

-- -----------------------------------------------------
-- Table public.lote_productos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lote_productos (
  id INT NOT NULL,
  id_producto INT NOT NULL,
  costo_unitario DECIMAL(18,2) NOT NULL,
  precio_lote DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL,
  fecha_ingreso TIMESTAMP NOT NULL,
  fecha_vencimiento TIMESTAMP NOT NULL,
  descripcion TEXT NULL,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  usuario_modificacion INT NULL,
  fecha_modificacion TIMESTAMP NULL,
  estado SMALLINT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_lote_productos_productos1
    FOREIGN KEY (id_producto)
    REFERENCES public.productos (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE INDEX fk_lote_productos_productos1_idx ON public.lote_productos (id_producto ASC);

-- -----------------------------------------------------
-- Table public.ventas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ventas (
  id SERIAL NOT NULL,
  fecha_venta TIMESTAMP NOT NULL,
  total DECIMAL(18,2) NOT NULL,
  estado_venta VARCHAR(20) NOT NULL CHECK (estado_venta IN ('pendiente', 'pagado', 'cancelado', 'reembolsado', 'solicitud_reembolso')),
  observaciones TEXT NULL,
  nit INT NULL,
  nombre VARCHAR(255) NULL,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  usuario_modificacion INT NULL,
  fecha_modificacion TIMESTAMP NULL,
  estado SMALLINT NOT NULL,
  PRIMARY KEY (id));

-- -----------------------------------------------------
-- Table public.detalle_ventas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.detalle_ventas (
  id SERIAL NOT NULL,
  id_venta INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(18,2) NOT NULL,
  subtotal DECIMAL(18,2) NOT NULL,
  descuento DECIMAL(18,2) NULL,
  id_producto INT NOT NULL,
  id_lote_producto INT NULL,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  usuario_modificacion INT NULL,
  fecha_modificacion TIMESTAMP NULL,
  estado SMALLINT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_salida_has_productos_lotes_salida1
    FOREIGN KEY (id_venta)
    REFERENCES public.ventas (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_detalle_venta_lote_productos1
    FOREIGN KEY (id_lote_producto)
    REFERENCES public.lote_productos (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_detalle_ventas_productos1
    FOREIGN KEY (id_producto)
    REFERENCES public.productos (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE INDEX fk_salida_has_productos_lotes_salida1_idx ON public.detalle_ventas (id_venta ASC);
CREATE INDEX fk_detalle_venta_lote_productos1_idx ON public.detalle_ventas (id_lote_producto ASC);
CREATE INDEX fk_detalle_ventas_productos1_idx ON public.detalle_ventas (id_producto ASC);

-- -----------------------------------------------------
-- Table public.pagos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pagos (
  id SERIAL NOT NULL,
  metodo_pago VARCHAR(20) NOT NULL CHECK (metodo_pago IN ('Efectivo', 'Tarjeta Crédito', 'Tarjeta Débito', 'Transferencia')),
  monto DECIMAL(10,2) NOT NULL,
  id_venta INT NOT NULL,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  usuario_modificacion INT NULL,
  fecha_modificacion TIMESTAMP NULL,
  estado SMALLINT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_pagos_facturacion1
    FOREIGN KEY (id_venta)
    REFERENCES public.ventas (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE INDEX fk_pagos_facturacion1_idx ON public.pagos (id_venta ASC);

-- -----------------------------------------------------
-- Table public.devoluciones
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.devoluciones (
  id SERIAL NOT NULL,
  id_venta INT NOT NULL,
  fecha_devolucion TIMESTAMP NOT NULL,
  motivo TEXT NOT NULL,
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('pendiente', 'aprobada', 'rechazada')),
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  usuario_modificacion INT NULL,
  fecha_modificacion TIMESTAMP NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_devoluciones_facturacion1
    FOREIGN KEY (id_venta)
    REFERENCES public.ventas (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE INDEX fk_devoluciones_facturacion1_idx ON public.devoluciones (id_venta ASC);

-- -----------------------------------------------------
-- Table public.devoluciones_detalle
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.devoluciones_detalle (
  id_detalle SERIAL NOT NULL,
  cantidad INT NOT NULL,
  monto_reembolso DECIMAL(10,2) NOT NULL,
  id_devolucione INT NOT NULL,
  id_detalle_venta INT NOT NULL,
  PRIMARY KEY (id_detalle),
  CONSTRAINT fk_devoluciones_detalle_devoluciones1
    FOREIGN KEY (id_devolucione)
    REFERENCES public.devoluciones (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_devoluciones_detalle_detalle_ventas1
    FOREIGN KEY (id_detalle_venta)
    REFERENCES public.detalle_ventas (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE INDEX fk_devoluciones_detalle_devoluciones1_idx ON public.devoluciones_detalle (id_devolucione ASC);
CREATE INDEX fk_devoluciones_detalle_detalle_ventas1_idx ON public.devoluciones_detalle (id_detalle_venta ASC);

-- -----------------------------------------------------
-- Table public.combos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.combos (
  id SERIAL NOT NULL,
  descripcion TEXT NOT NULL,
  nombre VARCHAR(45) NOT NULL,
  precio_final DECIMAL(18,2) NOT NULL,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  usuario_modificacion INT NULL,
  fecha_modificacion TIMESTAMP NULL,
  estado SMALLINT NOT NULL,
  PRIMARY KEY (id));

-- -----------------------------------------------------
-- Table public.asignacion_combos_productos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.asignacion_combos_productos (
  id SERIAL NOT NULL,
  id_combo INT NOT NULL,
  cantidad INT NOT NULL,
  id_producto INT NOT NULL,
  id_lote_producto INT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_asignacion_combos_productos_prep_combos1
    FOREIGN KEY (id_combo)
    REFERENCES public.combos (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_asignacion_combos_productos_productos1
    FOREIGN KEY (id_producto)
    REFERENCES public.productos (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_asignacion_combos_productos_lote_productos1
    FOREIGN KEY (id_lote_producto)
    REFERENCES public.lote_productos (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE INDEX fk_asignacion_combos_productos_prep_combos1_idx ON public.asignacion_combos_productos (id_combo ASC);
CREATE INDEX fk_asignacion_combos_productos_productos1_idx ON public.asignacion_combos_productos (id_producto ASC);
CREATE INDEX fk_asignacion_combos_productos_lote_productos1_idx ON public.asignacion_combos_productos (id_lote_producto ASC);

-- -----------------------------------------------------
-- Table public.asignacion_receta_materia_prima
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.asignacion_receta_materia_prima (
  id_producto INT NOT NULL,
  id_receta INT NOT NULL,
  unidad_medida VARCHAR(45) NOT NULL,
  cantidad_requerida INT NOT NULL,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  usuario_modificacion INT NULL,
  fecha_modificacion TIMESTAMP NULL,
  estado SMALLINT NOT NULL,
  PRIMARY KEY (id_producto, id_receta),
  CONSTRAINT fk_asignacion_recetas_productos_productos1
    FOREIGN KEY (id_producto)
    REFERENCES public.productos (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_asignacion_recetas_productos_recetas1
    FOREIGN KEY (id_receta)
    REFERENCES public.recetas (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE INDEX fk_asignacion_recetas_productos_productos1_idx ON public.asignacion_receta_materia_prima (id_producto ASC);
CREATE INDEX fk_asignacion_recetas_productos_recetas1_idx ON public.asignacion_receta_materia_prima (id_receta ASC);

-- Restaurar configuraciones (no aplica exactamente igual en PostgreSQL)
-- SET SESSION session_replication_role = DEFAULT;

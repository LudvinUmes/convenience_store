-- -----------------------------------------------------
-- Type public.tipo_producto_enum
-- -----------------------------------------------------
DO $$ BEGIN
  CREATE TYPE tipo_producto_enum AS ENUM ('FINAL', 'PREPARADO');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- -----------------------------------------------------
-- Table public.marcas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marcas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL  DEFAULT now(),
  usuario_modificacion INT,
  fecha_modificacion TIMESTAMP,
  estado SMALLINT NOT NULL DEFAULT 1
);

-- -----------------------------------------------------
-- Table public.categoria
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(45) NOT NULL,
  descripcion TEXT,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT now(),
  usuario_modificacion INT,
  fecha_modificacion TIMESTAMP,
  estado SMALLINT NOT NULL DEFAULT 1
);


-- -----------------------------------------------------
-- Table public.unidades_medida
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.unidades_medida (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,          
  abreviatura VARCHAR(10) NOT NULL,     
  descripcion TEXT,
  estado SMALLINT NOT NULL DEFAULT 1,   
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT now(),
  usuario_modificacion INT,
  fecha_modificacion TIMESTAMP
);


-- -----------------------------------------------------
-- Table public.productos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(45) NOT NULL,
  descripcion TEXT,
  precio_referencia DECIMAL(20,18) NOT NULL,
  id_unidad_medida INT NOT NULL REFERENCES unidades_medida(id),
  stock_minimo INT NOT NULL,
  id_categoria INT NOT NULL REFERENCES categorias(id),
  tipo tipo_producto_enum NOT NULL DEFAULT 'FINAL',
  id_marca INT REFERENCES marcas(id),
  es_materia_prima BOOLEAN NOT NULL,
  receta TEXT,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT now(),
  usuario_modificacion INT,
  fecha_modificacion TIMESTAMP,
  estado SMALLINT NOT NULL DEFAULT 1
);

-------------------------------------------------
-- Table public.asignacion_receta_materia_prima
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.asignacion_producto_preparado_materia_prima (
  id SERIAL PRIMARY KEY,
  id_producto_preparado INT NOT NULL REFERENCES productos(id),
  id_producto_materia_prima INT NOT NULL REFERENCES productos(id),
  cantidad_requerida INT NOT NULL,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  usuario_modificacion INT,
  fecha_modificacion TIMESTAMP,
  estado SMALLINT NOT NULL DEFAULT 1
);


-- -----------------------------------------------------
-- Table public.combos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.combos (
  id SERIAL PRIMARY KEY,
  descripcion TEXT NOT NULL,
  nombre VARCHAR(45) NOT NULL,
  precio_final DECIMAL(18,2) NOT NULL,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT now(),
  usuario_modificacion INT,
  fecha_modificacion TIMESTAMP,
  estado SMALLINT NOT NULL DEFAULT 1
);

-- -----------------------------------------------------
-- Table public.lote_productos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lote_productos (
  id SERIAL PRIMARY KEY,
  id_producto INT NOT NULL REFERENCES productos(id),
  costo_unitario DECIMAL(18,2) NOT NULL,
  precio_lote DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL,
  fecha_ingreso TIMESTAMP NOT NULL,
  fecha_vencimiento TIMESTAMP NOT NULL,
  descripcion TEXT,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT now(),
  usuario_modificacion INT,
  fecha_modificacion TIMESTAMP,
  estado SMALLINT NOT NULL DEFAULT 1
);

-- -----------------------------------------------------
-- Table public.ventas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ventas (
  id SERIAL PRIMARY KEY,
  fecha_venta TIMESTAMP NOT NULL,
  total DECIMAL(18,2) NOT NULL,
  estado_venta VARCHAR(20) NOT NULL CHECK (estado_venta IN ('pendiente', 'pagado', 'cancelado', 'reembolsado', 'solicitud_reembolso')),
  observaciones TEXT,
  nit INT,
  nombre VARCHAR(255),
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT now(),
  usuario_modificacion INT,
  fecha_modificacion TIMESTAMP,
  estado SMALLINT NOT NULL DEFAULT 1
);

-- -----------------------------------------------------
-- Table public.detalle_ventas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.detalle_ventas (
  id SERIAL PRIMARY KEY,
  id_venta INT NOT NULL REFERENCES ventas(id),
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(18,2) NOT NULL,
  subtotal DECIMAL(18,2) NOT NULL,
  descuento DECIMAL(18,2),
  id_producto INT NOT NULL REFERENCES productos(id),
  id_lote_producto INT REFERENCES lote_productos(id),
  id_combo INT REFERENCES combos(id),
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT now(),
  usuario_modificacion INT,
  fecha_modificacion TIMESTAMP,
  estado SMALLINT NOT NULL DEFAULT 1
);

-- -----------------------------------------------------
-- Table public.pagos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pagos (
  id SERIAL PRIMARY KEY,
  metodo_pago VARCHAR(20) NOT NULL CHECK (metodo_pago IN ('Efectivo', 'Tarjeta Crédito', 'Tarjeta Débito', 'Transferencia')),
  monto DECIMAL(10,2) NOT NULL,
  id_venta INT NOT NULL REFERENCES ventas(id),
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT now(),
  usuario_modificacion INT,
  fecha_modificacion TIMESTAMP,
  estado SMALLINT NOT NULL DEFAULT 1
);

-- -----------------------------------------------------
-- Table public.devoluciones
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.devoluciones (
  id SERIAL PRIMARY KEY,
  id_venta INT NOT NULL REFERENCES ventas(id),
  fecha_devolucion TIMESTAMP NOT NULL,
  motivo TEXT NOT NULL,
  estado_devolucion VARCHAR(20) NOT NULL CHECK (estado_devolucion IN ('pendiente', 'aprobada', 'rechazada')),
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT now(),
  usuario_modificacion INT,
  fecha_modificacion TIMESTAMP,
  estado SMALLINT NOT NULL DEFAULT 1
);

-- -----------------------------------------------------
-- Table public.devoluciones_detalle
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.devoluciones_detalle (
  id_detalle SERIAL PRIMARY KEY,
  cantidad INT NOT NULL,
  monto_reembolso DECIMAL(10,2) NOT NULL,
  id_devolucion INT NOT NULL REFERENCES devoluciones(id),
  id_detalle_venta INT NOT NULL REFERENCES detalle_ventas(id),
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT now(),
  usuario_modificacion INT,
  fecha_modificacion TIMESTAMP,
  estado SMALLINT NOT NULL DEFAULT 1
);

-- -----------------------------------------------------
-- Table public.asignacion_combos_productos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.asignacion_combos_productos (
  id SERIAL PRIMARY KEY,
  id_combo INT NOT NULL REFERENCES combos(id),
  cantidad INT NOT NULL,
  id_producto INT NOT NULL REFERENCES productos(id),
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT now(),
  usuario_modificacion INT,
  fecha_modificacion TIMESTAMP,
  estado SMALLINT NOT NULL DEFAULT 1
);


-- -----------------------------------------------------
-- Table public.movimientos_inventario
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.movimientos_inventario (
  id SERIAL PRIMARY KEY,
  id_producto INT NOT NULL REFERENCES productos(id),
  id_lote INT REFERENCES lote_productos(id),
  tipo_movimiento VARCHAR(20) NOT NULL CHECK (tipo_movimiento IN ('INGRESO_LOTE', 'VENTA', 'DEVOLUCION', 'MERMA', 'AJUSTE')),
  cantidad INT NOT NULL CHECK (cantidad > 0),
  descripcion TEXT,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT now(),
  usuario_modificacion INT,
  fecha_modificacion TIMESTAMP,
  estado SMALLINT NOT NULL DEFAULT 1
);

-- -----------------------------------------------------
-- Table public.alertas_stock
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.alertas_stock (
  id SERIAL PRIMARY KEY,
  id_producto INT NOT NULL REFERENCES productos(id),
  stock_actual INT NOT NULL,
  stock_minimo INT NOT NULL,
  fecha_alerta TIMESTAMP NOT NULL DEFAULT now(),
  atendida BOOLEAN NOT NULL DEFAULT FALSE
);

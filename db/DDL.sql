-- PostgreSQL Script
-- Sun Mar 23 10:07:52 2025
-- Model: New Model    Version: 1.0

-- Crear el esquema si no existe
CREATE SCHEMA IF NOT EXISTS store_db;

-- Establecer el esquema por defecto
SET search_path TO store_db;

-- Tabla marcas
CREATE TABLE IF NOT EXISTS marcas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  usuario_modificacion INT NULL,
  fecha_modificacion TIMESTAMP NULL,
  estado SMALLINT NOT NULL
);

-- Tabla tipos_producto
CREATE TABLE IF NOT EXISTS tipos_producto (
  id SERIAL PRIMARY KEY,
  name VARCHAR(45) NOT NULL,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  usuario_modificacion VARCHAR(45) NULL,
  fecha_modificacion TIMESTAMP NULL,
  estado SMALLINT NOT NULL
);

-- Tabla productos
CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(45) NOT NULL,
  descripcion TEXT NULL,
  precio_referencia NUMERIC(20, 18) NOT NULL,
  unidad_medida VARCHAR(45) NOT NULL,
  stock_minimo INT NOT NULL,
  id_tipo INT NOT NULL,
  id_marca INT NOT NULL,
  es_preparado BOOLEAN NOT NULL,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  usuario_modificacion INT NULL,
  fecha_modificacion TIMESTAMP NULL,
  estado SMALLINT NOT NULL,
  CONSTRAINT fk_productos_tipos_producto1 FOREIGN KEY (id_tipo) REFERENCES tipos_producto (id),
  CONSTRAINT fk_productos_marcas1 FOREIGN KEY (id_marca) REFERENCES marcas (id)
);

-- Tabla lote_productos
CREATE TABLE IF NOT EXISTS lote_productos (
  id SERIAL PRIMARY KEY,
  id_producto INT NOT NULL,
  costo_unitario NUMERIC(20, 2) NOT NULL,
  precio_lote NUMERIC(10, 2) NOT NULL,
  stock INT NOT NULL,
  fecha_ingreso TIMESTAMP NOT NULL,
  fecha_vencimiento TIMESTAMP NOT NULL,
  descripcion TEXT NULL,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  usuario_modificacion INT NULL,
  fecha_modificacion TIMESTAMP NULL,
  estado SMALLINT NOT NULL,
  CONSTRAINT fk_lote_productos_productos1 FOREIGN KEY (id_producto) REFERENCES productos (id)
);

-- Tabla ventas
CREATE TABLE IF NOT EXISTS ventas (
  id SERIAL PRIMARY KEY,
  fecha_venta TIMESTAMP NOT NULL,
  total NUMERIC(20, 2) NOT NULL,
  estado_venta VARCHAR(50) NOT NULL CHECK (estado_venta IN ('pendiente', 'pagado', 'cancelado', 'reembolsado', 'solicitud_reembolso')),
  observaciones TEXT NULL,
  nit INT NULL,
  nombre VARCHAR(255) NULL,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  usuario_modificacion INT NULL,
  fecha_modificacion TIMESTAMP NULL,
  estado SMALLINT NOT NULL
);

-- Tabla detalle_ventas
CREATE TABLE IF NOT EXISTS detalle_ventas (
  id SERIAL PRIMARY KEY,
  id_venta INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario NUMERIC(20, 2) NOT NULL,
  subtotal NUMERIC(20, 2) NOT NULL,
  descuento NUMERIC(20, 2) NULL,
  id_lote_producto INT NOT NULL,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  usuario_modificacion INT NULL,
  fecha_modificacion TIMESTAMP NULL,
  estado SMALLINT NOT NULL,
  CONSTRAINT fk_salida_has_productos_lotes_salida1 FOREIGN KEY (id_venta) REFERENCES ventas (id),
  CONSTRAINT fk_detalle_venta_lote_productos1 FOREIGN KEY (id_lote_producto) REFERENCES lote_productos (id)
);

-- Tabla pagos
CREATE TABLE IF NOT EXISTS pagos (
  id SERIAL PRIMARY KEY,
  metodo_pago VARCHAR(50) NOT NULL CHECK (metodo_pago IN ('Efectivo', 'Tarjeta Crédito', 'Tarjeta Débito', 'Transferencia')),
  monto NUMERIC(10, 2) NOT NULL,
  id_venta INT NOT NULL,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  usuario_modificacion INT NULL,
  fecha_modificacion TIMESTAMP NULL,
  estado SMALLINT NOT NULL,
  CONSTRAINT fk_pagos_facturacion1 FOREIGN KEY (id_venta) REFERENCES ventas (id)
);

-- Tabla devoluciones
CREATE TABLE IF NOT EXISTS devoluciones (
  id SERIAL PRIMARY KEY,
  id_venta INT NOT NULL,
  fecha_devolucion TIMESTAMP NOT NULL,
  motivo TEXT NOT NULL,
  estado VARCHAR(50) NOT NULL CHECK (estado IN ('pendiente', 'aprobada', 'rechazada')),
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  usuario_modificacion INT NULL,
  fecha_modificacion TIMESTAMP NULL,
  CONSTRAINT fk_devoluciones_facturacion1 FOREIGN KEY (id_venta) REFERENCES ventas (id)
);

-- Tabla devoluciones_detalle
CREATE TABLE IF NOT EXISTS devoluciones_detalle (
  id_detalle SERIAL PRIMARY KEY,
  cantidad INT NOT NULL,
  monto_reembolso NUMERIC(10, 2) NOT NULL,
  id_devolucione INT NOT NULL,
  id_detalle_venta INT NOT NULL,
  CONSTRAINT fk_devoluciones_detalle_devoluciones1 FOREIGN KEY (id_devolucione) REFERENCES devoluciones (id),
  CONSTRAINT fk_devoluciones_detalle_detalle_ventas1 FOREIGN KEY (id_detalle_venta) REFERENCES detalle_ventas (id)
);

-- Tabla combos
CREATE TABLE IF NOT EXISTS combos (
  id SERIAL PRIMARY KEY,
  descripcion TEXT NOT NULL,
  nombre VARCHAR(45) NOT NULL,
  precio_final NUMERIC(20, 2) NOT NULL,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  usuario_modificacion INT NULL,
  fecha_modificacion TIMESTAMP NULL,
  estado SMALLINT NOT NULL
);

-- Tabla recetas
CREATE TABLE IF NOT EXISTS recetas (
  id SERIAL PRIMARY KEY,
  id_producto INT NOT NULL,
  unidad_medida VARCHAR(45) NOT NULL,
  cantidad_requerida INT NOT NULL,
  usuario_creacion INT NOT NULL,
  fecha_creacion TIMESTAMP NOT NULL,
  usuario_modificacion INT NULL,
  fecha_modificacion TIMESTAMP NULL,
  estado SMALLINT NOT NULL,
  CONSTRAINT fk_asignacion_materias_primas_receta_productos1 FOREIGN KEY (id_producto) REFERENCES productos (id)
);

-- Tabla asignacion_combos_productos
CREATE TABLE IF NOT EXISTS asignacion_combos_productos (
  id SERIAL PRIMARY KEY,
  id_combo INT NOT NULL,
  id_lote_producto INT NOT NULL,
  cantidad INT NOT NULL,
  CONSTRAINT fk_asignacion_combos_productos_prep_combos1 FOREIGN KEY (id_combo) REFERENCES combos (id),
  CONSTRAINT fk_asignacion_combos_productos_prep_lote_productos1 FOREIGN KEY (id_lote_producto) REFERENCES lote_productos (id)
);
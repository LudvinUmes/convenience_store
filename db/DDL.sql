-- Crear esquema si no existe
CREATE SCHEMA IF NOT EXISTS store_db;
SET search_path TO store_db;

-- Tabla: marcas
CREATE TABLE IF NOT EXISTS marcas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    usuario_creacion INT NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    usuario_modificacion INT NULL,
    fecha_modificacion TIMESTAMP NULL,
    estado SMALLINT NOT NULL
);

-- Tabla: tipos_producto
CREATE TABLE IF NOT EXISTS tipos_producto (
    id SERIAL PRIMARY KEY,
    name VARCHAR(45) NOT NULL,
    usuario_creacion INT NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    usuario_modificacion VARCHAR(45) NULL,
    fecha_modificacion TIMESTAMP NULL,
    estado SMALLINT NOT NULL
);

-- Tabla: productos
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL,
    descripcion TEXT NULL,
    precio_referencia DECIMAL(18,2) NOT NULL,
    unidad_medida VARCHAR(45) NOT NULL,
    stock_minimo INT NOT NULL,
    id_tipo INT NOT NULL,
    id_marca INT NOT NULL,
    usuario_creacion INT NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    usuario_modificacion INT NULL,
    fecha_modificacion TIMESTAMP NULL,
    estado SMALLINT NOT NULL,
    CONSTRAINT fk_productos_tipos FOREIGN KEY (id_tipo) REFERENCES tipos_producto (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT fk_productos_marcas FOREIGN KEY (id_marca) REFERENCES marcas (id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla: lote_productos
CREATE TABLE IF NOT EXISTS lote_productos (
    id SERIAL PRIMARY KEY,
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
    CONSTRAINT fk_lote_productos_productos FOREIGN KEY (id_producto) REFERENCES productos (id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla: materias_primas
CREATE TABLE IF NOT EXISTS materias_primas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NULL,
    unidad_medida VARCHAR(45) NOT NULL,
    stock_minimo INT NOT NULL,
    categoria_materia VARCHAR(45) NOT NULL,
    usuario_creacion INT NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    usuario_modificacion INT NULL,
    fecha_modificacion TIMESTAMP NULL,
    estado SMALLINT NOT NULL
);

-- Tabla: lote_materias
CREATE TABLE IF NOT EXISTS lote_materias (
    id SERIAL PRIMARY KEY,
    id_materia INT NOT NULL,
    costo_unitario INT NOT NULL,
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
    CONSTRAINT fk_lote_materias_materias FOREIGN KEY (id_materia) REFERENCES materias_primas (id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla: ventas
CREATE TYPE estado_venta AS ENUM ('pendiente', 'pagado', 'cancelado');

CREATE TABLE IF NOT EXISTS ventas (
    id SERIAL PRIMARY KEY,
    fecha_venta TIMESTAMP NOT NULL,
    total DECIMAL(18,2) NOT NULL,
    estado estado_venta NOT NULL,
    observaciones TEXT NULL,
    nit INT NULL,
    nombre VARCHAR(255) NULL,
    usuario_creacion INT NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    usuario_modificacion INT NULL,
    fecha_modificacion TIMESTAMP NULL,
    estado_copy1 SMALLINT NOT NULL
);

-- Tabla: detalle_ventas
CREATE TABLE IF NOT EXISTS detalle_ventas (
    id SERIAL PRIMARY KEY,
    id_venta INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(18,2) NOT NULL,
    subtotal DECIMAL(18,2) NOT NULL,
    usuario_creacion INT NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    usuario_modificacion INT NULL,
    fecha_modificacion TIMESTAMP NULL,
    estado SMALLINT NOT NULL,
    id_lote_producto INT NULL,
    id_producto_preparado INT NULL,
    CONSTRAINT fk_detalle_ventas_venta FOREIGN KEY (id_venta) REFERENCES ventas (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT fk_detalle_ventas_lote FOREIGN KEY (id_lote_producto) REFERENCES lote_productos (id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla: pagos
CREATE TYPE metodo_pago AS ENUM ('Efectivo', 'Tarjeta Crédito', 'Tarjeta Débito', 'Transferencia');

CREATE TABLE IF NOT EXISTS pagos (
    id SERIAL PRIMARY KEY,
    metodo_pago metodo_pago NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    id_venta INT NOT NULL,
    usuario_creacion INT NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    usuario_modificacion INT NULL,
    fecha_modificacion TIMESTAMP NULL,
    estado SMALLINT NOT NULL,
    CONSTRAINT fk_pagos_venta FOREIGN KEY (id_venta) REFERENCES ventas (id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla: devoluciones
CREATE TYPE estado_devolucion AS ENUM ('pendiente', 'aprobada', 'rechazada');

CREATE TABLE IF NOT EXISTS devoluciones (
    id SERIAL PRIMARY KEY,
    id_venta INT NOT NULL,
    fecha_devolucion TIMESTAMP NOT NULL,
    motivo TEXT NOT NULL,
    estado estado_devolucion NOT NULL,
    usuario_creacion INT NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    usuario_modificacion INT NULL,
    fecha_modificacion TIMESTAMP NULL,
    CONSTRAINT fk_devoluciones_venta FOREIGN KEY (id_venta) REFERENCES ventas (id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tabla: productos_receta
CREATE TABLE IF NOT EXISTS productos_receta (
    id SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    nombre_receta VARCHAR(45) NULL,
    id_productos_preparados INT NOT NULL,
    usuario_creacion INT NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    usuario_modificacion INT NULL,
    fecha_modificacion TIMESTAMP NULL,
    estado SMALLINT NOT NULL,
    CONSTRAINT fk_productos_receta_preparados FOREIGN KEY (id_productos_preparados) REFERENCES productos (id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

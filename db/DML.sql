INSERT INTO store_db.marcas(
	nombre, usuario_creacion, fecha_creacion, estado)
VALUES ('Coca-Cola', 1, now(), 1);

INSERT INTO store_db.tipos_producto(
	name, usuario_creacion, fecha_creacion, estado)
	VALUES ('Gaseosas', 1, now(), 1);

INSERT INTO store_db.productos(
	nombre, descripcion, precio_referencia, unidad_medida, stock_minimo, id_tipo, id_marca, usuario_creacion, fecha_creacion, estado)
	VALUES ('Coca-cola', 'Lata', 10, 'ml', 1000, 1, 1, 1, now(), 1);

SELECT * FROM store_db.productos;
SELECT * FROM store_db.tipos_producto;
SELECT * FROM store_db.marcas;
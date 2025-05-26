import { PrismaClient, tipo_producto_enum } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed detallado para Hot Dog...');

  // 1. Crear unidades de medida
  const unidadPieza = await prisma.unidades_medida.create({
    data: {
      nombre: 'Pieza',
      abreviatura: 'pz',
      descripcion: 'Unidad individual de producto',
      usuario_creacion: 1,
    },
  });

  const unidadSobre = await prisma.unidades_medida.create({
    data: {
      nombre: 'Sobre',
      abreviatura: 'sb',
      descripcion: 'Presentación individual sellada',
      usuario_creacion: 1,
    },
  });

  // 2. Crear categorías
  const categoriaPan = await prisma.categorias.create({
    data: {
      nombre: 'Panadería',
      descripcion: 'Panes para hot dogs y hamburguesas',
      usuario_creacion: 1,
    },
  });

  const categoriaEmbutidos = await prisma.categorias.create({
    data: {
      nombre: 'Embutidos',
      descripcion: 'Carnes procesadas como salchichas',
      usuario_creacion: 1,
    },
  });

  const categoriaSalsas = await prisma.categorias.create({
    data: {
      nombre: 'Salsas y Condimentos',
      descripcion: 'Sobres individuales de salsas',
      usuario_creacion: 1,
    },
  });

  const categoriaComidaRapida = await prisma.categorias.create({
    data: {
      nombre: 'Comida Rápida',
      descripcion: 'Productos preparados listos para comer',
      usuario_creacion: 1,
    },
  });

  // 3. Crear marcas
  const marcaPan = await prisma.marcas.create({
    data: {
      nombre: 'Panadería San Juan',
      usuario_creacion: 1,
    },
  });

  const marcaSalchicha = await prisma.marcas.create({
    data: {
      nombre: 'Oscar Mayer',
      usuario_creacion: 1,
    },
  });

  const marcaMayonesa = await prisma.marcas.create({
    data: {
      nombre: "Hellmann's",
      usuario_creacion: 1,
    },
  });

  const marcaInterna = await prisma.marcas.create({
    data: {
      nombre: 'Marca de la tienda',
      usuario_creacion: 1,
    },
  });

  // 4. Crear productos materia prima
  const pan = await prisma.productos.create({
    data: {
      nombre: 'Pan para Hot Dog',
      descripcion: 'Pan blanco suave',
      precio_referencia: 0.5,
      id_unidad_medida: unidadPieza.id,
      stock_minimo: 20,
      tipo: tipo_producto_enum.FINAL,
      es_materia_prima: true,
      id_categoria: categoriaPan.id,
      id_marca: marcaPan.id,
      usuario_creacion: 1,
    },
  });

  const salchicha = await prisma.productos.create({
    data: {
      nombre: 'Salchicha Americana',
      descripcion: 'Carne procesada para hot dog',
      precio_referencia: 0.75,
      id_unidad_medida: unidadPieza.id,
      stock_minimo: 30,
      tipo: tipo_producto_enum.FINAL,
      es_materia_prima: true,
      id_categoria: categoriaEmbutidos.id,
      id_marca: marcaSalchicha.id,
      usuario_creacion: 1,
    },
  });

  const mayonesa = await prisma.productos.create({
    data: {
      nombre: 'Mayonesa Individual',
      descripcion: "Sobre de mayonesa Hellmann's",
      precio_referencia: 0.25,
      id_unidad_medida: unidadSobre.id,
      stock_minimo: 50,
      tipo: tipo_producto_enum.FINAL,
      es_materia_prima: true,
      id_categoria: categoriaSalsas.id,
      id_marca: marcaMayonesa.id,
      usuario_creacion: 1,
    },
  });

  // 5. Crear producto preparado
  const hotDog = await prisma.productos.create({
    data: {
      nombre: 'Hot Dog Clásico',
      descripcion: 'Hot dog con pan, salchicha y mayonesa',
      precio_referencia: 2.5,
      id_unidad_medida: unidadPieza.id,
      stock_minimo: 10,
      tipo: tipo_producto_enum.PREPARADO,
      es_materia_prima: false,
      receta: '1 pan, 1 salchicha, 1 sobre de mayonesa',
      id_categoria: categoriaComidaRapida.id,
      id_marca: marcaInterna.id,
      usuario_creacion: 1,
    },
  });

  // 6. Asignar materias primas al producto preparado
  await prisma.asignacion_producto_preparado_materia_prima.createMany({
    data: [
      {
        id_producto_preparado: hotDog.id,
        id_producto_materia_prima: pan.id,
        cantidad_requerida: 1,
        usuario_creacion: 1,
        fecha_creacion: new Date(),
      },
      {
        id_producto_preparado: hotDog.id,
        id_producto_materia_prima: salchicha.id,
        cantidad_requerida: 1,
        usuario_creacion: 1,
        fecha_creacion: new Date(),
      },
      {
        id_producto_preparado: hotDog.id,
        id_producto_materia_prima: mayonesa.id,
        cantidad_requerida: 1,
        usuario_creacion: 1,
        fecha_creacion: new Date(),
      },
    ],
  });

  console.log('🌭 Hot Dog Clásico y sus ingredientes creados exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });

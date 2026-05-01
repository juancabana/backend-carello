import type { DataSource } from 'typeorm';

export const PRODUCTS_SEED = [
  {
    id: 'p-vainilla',
    slug: 'vainilla-bourbon',
    name: 'Vainilla Bourbon',
    description:
      'Helado artesanal con extracto puro de vainilla Bourbon de Madagascar. Cremoso, delicado y con un aroma inconfundible.',
    price: 4.5,
    category: 'helados',
    image: '/carello/flavors/vainilla.jpg',
    tags: ['clásico', 'cremoso', 'sin gluten'],
    available: true,
  },
  {
    id: 'p-chocolate',
    slug: 'chocolate-belga',
    name: 'Chocolate Belga',
    description:
      'Elaborado con cacao belga 72% de origen único. Intenso, profundo y con notas afrutadas que lo hacen único.',
    price: 5.0,
    category: 'helados',
    image: '/carello/flavors/chocolate.jpg',
    tags: ['intenso', 'sin gluten', 'cacao premium'],
    available: true,
  },
  {
    id: 'p-fresa',
    slug: 'fresa-silvestre',
    name: 'Fresa Silvestre',
    description:
      'Fresitas silvestres recogidas en temporada. Textura suave con trozos de fruta real para una experiencia auténtica.',
    price: 4.75,
    category: 'helados',
    image: '/carello/flavors/fresa.jpg',
    tags: ['fruta', 'temporada', 'sin gluten'],
    available: true,
  },
  {
    id: 'p-pistacho',
    slug: 'pistacho-siciliano',
    name: 'Pistacho Siciliano',
    description:
      'Pistachos de Bronte (DOP) tostados en casa. Verde vibrante, sabor profundo y textura perfectamente equilibrada.',
    price: 5.5,
    category: 'helados',
    image: '/carello/flavors/pistacho.jpg',
    tags: ['premium', 'DOP', 'sin gluten'],
    available: true,
  },
  {
    id: 'p-dulce',
    slug: 'dulce-de-leche',
    name: 'Dulce de Leche',
    description:
      'Receta tradicional argentina con leche de vaca de pastoreo. Caramelo suave, profundo y nostálgico en cada cucharada.',
    price: 5.0,
    category: 'helados',
    image: '/carello/flavors/dulce.jpg',
    tags: ['caramelo', 'cremoso', 'sin gluten'],
    available: true,
  },
  {
    id: 'p-mango',
    slug: 'mango-maracuya',
    name: 'Mango Maracuyá',
    description:
      'Sorbete tropical con mangos Alfonso y maracuyá fresco. Refrescante, ácido en el punto justo y con un color vibrante.',
    price: 4.75,
    category: 'sorbetes',
    image: '/carello/flavors/mango.jpg',
    tags: ['tropical', 'vegano', 'sin gluten', 'sin lactosa'],
    available: true,
  },
  {
    id: 'p-limon',
    slug: 'limon-albahaca',
    name: 'Limón y Albahaca',
    description:
      'Sorbete de limón siciliano con albahaca fresca del jardín. Fresco, aromático y sorprendente. Ideal para limpiar el paladar.',
    price: 4.5,
    category: 'sorbetes',
    image: '/carello/flavors/limon.jpg',
    tags: ['cítrico', 'vegano', 'sin gluten', 'sin lactosa'],
    available: true,
  },
  {
    id: 'p-affogato',
    slug: 'affogato-carello',
    name: 'Affogato Carello',
    description:
      'Nuestro helado de vainilla Bourbon ahogado en un espresso doble recién extraído. El postre perfecto en formato helado.',
    price: 6.5,
    category: 'postres',
    image: '/carello/flavors/affogato.jpg',
    tags: ['café', 'especial', 'sin gluten'],
    available: true,
  },
];

export async function seedProducts(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository('products');
  for (const product of PRODUCTS_SEED) {
    const exists = await repo.findOne({ where: { id: product.id } });
    if (!exists) {
      await repo.save(repo.create(product));
      console.log(`  ✓ Producto creado: ${product.name}`);
    } else {
      console.log(`  - Producto ya existe: ${product.name}`);
    }
  }
}

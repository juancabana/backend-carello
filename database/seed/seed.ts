import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { seedProducts } from './products.seed.js';
import { seedStaff } from './staff.seed.js';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env['DATABASE_SEED_URL'] ?? process.env['DATABASE_URL'],
  ssl: { rejectUnauthorized: false },
  synchronize: true,
  entities: [__dirname + '/../../src/**/*.orm-entity{.ts,.js}'],
  logging: false,
});

async function main() {
  console.log('🌱 Iniciando seed de Carello...\n');
  await dataSource.initialize();

  console.log('📦 Productos:');
  await seedProducts(dataSource);

  console.log('\n👥 Staff:');
  await seedStaff(dataSource);

  await dataSource.destroy();
  console.log('\n✅ Seed completado exitosamente');
}

main().catch((err) => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});

import * as bcrypt from 'bcrypt';
import type { DataSource } from 'typeorm';

const STAFF_DATA = [
  {
    id: 'u-1',
    name: 'Elena Cárdenas',
    role: 'administrador',
    email: 'elena@carello.es',
  },
  {
    id: 'u-2',
    name: 'Tomás Beltrán',
    role: 'cajero',
    email: 'tomas@carello.es',
  },
  {
    id: 'u-3',
    name: 'Lucía Pérez',
    role: 'repartidor',
    email: 'lucia@carello.es',
  },
  {
    id: 'u-4',
    name: 'Marcos Ruiz',
    role: 'repartidor',
    email: 'marcos@carello.es',
  },
  { id: 'u-5', name: 'Sara Vidal', role: 'cajero', email: 'sara@carello.es' },
];

export async function seedStaff(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository('staff');
  const password = process.env['SEED_PASSWORD'] ?? 'carello2026';
  const rounds = parseInt(process.env['BCRYPT_ROUNDS'] ?? '10', 10);
  const hash = await bcrypt.hash(password, rounds);

  for (const member of STAFF_DATA) {
    const exists = await repo.findOne({ where: { id: member.id } });
    if (!exists) {
      await repo.save(repo.create({ ...member, passwordHash: hash }));
      console.log(`  ✓ Staff creado: ${member.name} (${member.role})`);
    } else {
      console.log(`  - Staff ya existe: ${member.name}`);
    }
  }
}

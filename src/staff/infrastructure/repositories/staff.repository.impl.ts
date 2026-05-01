import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffRepository } from '../../domain/repositories/staff.repository.js';
import type { StaffEntity } from '../../domain/entities/staff.entity.js';
import { StaffOrmEntity } from '../orm/staff.orm-entity.js';

@Injectable()
export class StaffRepositoryImpl extends StaffRepository {
  constructor(
    @InjectRepository(StaffOrmEntity)
    private readonly repo: Repository<StaffOrmEntity>,
  ) {
    super();
  }

  async getAll(): Promise<StaffEntity[]> {
    const staff = await this.repo.find({ order: { name: 'ASC' } });
    return staff.map(({ id, name, role, email }) => ({
      id,
      name,
      role,
      email,
    }));
  }

  async findByEmail(
    email: string,
  ): Promise<(StaffEntity & { passwordHash: string }) | null> {
    return this.repo.findOne({ where: { email } });
  }
}

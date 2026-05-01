import { Injectable } from '@nestjs/common';
import { StaffRepository } from '../../domain/repositories/staff.repository.js';
import type { StaffEntity } from '../../domain/entities/staff.entity.js';

@Injectable()
export class GetStaffUseCase {
  constructor(private readonly repo: StaffRepository) {}

  async execute(): Promise<StaffEntity[]> {
    return this.repo.getAll();
  }
}

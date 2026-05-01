import type { StaffEntity } from '../entities/staff.entity.js';

export abstract class StaffRepository {
  abstract getAll(): Promise<StaffEntity[]>;
  abstract findByEmail(
    email: string,
  ): Promise<(StaffEntity & { passwordHash: string }) | null>;
}

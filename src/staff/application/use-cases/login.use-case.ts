import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { StaffRepository } from '../../domain/repositories/staff.repository.js';
import type { JwtPayload } from '../../../shared/decorators/current-user.decorator.js';

export interface LoginResponse {
  access_token: string;
  staff: { id: string; name: string; role: string; email: string };
}

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly staffRepo: StaffRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(email: string, password: string): Promise<LoginResponse> {
    const staff = await this.staffRepo.findByEmail(email);
    if (!staff) throw new UnauthorizedException('Credenciales inválidas');

    const valid = await bcrypt.compare(password, staff.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    const payload: JwtPayload = {
      sub: staff.id,
      name: staff.name,
      role: staff.role,
    };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      staff: {
        id: staff.id,
        name: staff.name,
        role: staff.role,
        email: staff.email,
      },
    };
  }
}

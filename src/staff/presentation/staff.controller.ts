import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetStaffUseCase } from '../application/use-cases/get-staff.use-case.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../shared/guards/roles.guard.js';
import { Roles } from '../../shared/decorators/roles.decorator.js';

@Controller('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StaffController {
  constructor(private readonly getStaff: GetStaffUseCase) {}

  @Get()
  @Roles('administrador')
  findAll() {
    return this.getStaff.execute();
  }
}

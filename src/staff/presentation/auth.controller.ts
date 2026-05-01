import { Body, Controller, Post } from '@nestjs/common';
import { LoginUseCase } from '../application/use-cases/login.use-case.js';
import { LoginDto } from '../application/dtos/login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly login: LoginUseCase) {}

  @Post('login')
  signIn(@Body() dto: LoginDto) {
    return this.login.execute(dto.email, dto.password);
  }
}

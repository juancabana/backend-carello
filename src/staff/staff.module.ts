import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { StaffOrmEntity } from './infrastructure/orm/staff.orm-entity.js';
import { StaffRepositoryImpl } from './infrastructure/repositories/staff.repository.impl.js';
import { StaffRepository } from './domain/repositories/staff.repository.js';
import { JwtStrategy } from './infrastructure/jwt.strategy.js';
import { LoginUseCase } from './application/use-cases/login.use-case.js';
import { GetStaffUseCase } from './application/use-cases/get-staff.use-case.js';
import { AuthController } from './presentation/auth.controller.js';
import { StaffController } from './presentation/staff.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([StaffOrmEntity]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],

      useFactory: (config: ConfigService): any => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN') ?? '8h',
        },
      }),
    }),
  ],
  controllers: [AuthController, StaffController],
  providers: [
    { provide: StaffRepository, useClass: StaffRepositoryImpl },
    JwtStrategy,
    LoginUseCase,
    GetStaffUseCase,
  ],
  exports: [JwtModule],
})
export class StaffModule {}

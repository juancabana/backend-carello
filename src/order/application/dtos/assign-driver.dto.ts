import { IsOptional, IsString, MaxLength } from 'class-validator';

export class AssignDriverDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  driver!: string | null;
}

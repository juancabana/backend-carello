import { IsIn } from 'class-validator';

export class UpdateStatusDto {
  @IsIn(['pendiente', 'preparando', 'en_camino', 'entregado', 'cancelado'])
  status!: string;
}

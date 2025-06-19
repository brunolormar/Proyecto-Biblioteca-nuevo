import { PartialType } from '@nestjs/mapped-types';
import { CreatePrestamoDto } from './create-prestamo.dto';
import { IsOptional } from 'class-validator';

export class UpdatePrestamoDto extends PartialType(CreatePrestamoDto) {
    @IsOptional()
    libro_id: number;
  
    @IsOptional()
    usuario_id: string;
  
    @IsOptional()
    fecha_del_prestamo: string;
  
    @IsOptional()
    fecha_limite_a_devolver: string;
  
    @IsOptional()
    estado_del_prestamo: string;
  }
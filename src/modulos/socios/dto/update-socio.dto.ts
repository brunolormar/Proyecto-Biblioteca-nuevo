import { PartialType } from '@nestjs/mapped-types';
import { CreateSocioDto } from './create-socio.dto';
import { IsOptional } from 'class-validator';

export class UpdateSocioDto extends PartialType(CreateSocioDto) {
    @IsOptional()
    numero_de_socio: number;
  
    @IsOptional()
    nombre: string;
  
    @IsOptional()
    apellidos: string;
  
    @IsOptional()
    direccion: string;
  
    @IsOptional()
    DNI: string;
  
    @IsOptional()
    numero_de_telefono: number;
  }
  
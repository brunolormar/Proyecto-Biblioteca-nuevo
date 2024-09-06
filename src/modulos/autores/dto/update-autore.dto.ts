import { PartialType } from '@nestjs/mapped-types';
import { CreateAutoreDto } from './create-autore.dto';
import { IsOptional } from 'class-validator';

export class UpdateAutoreDto extends PartialType(CreateAutoreDto) {
    @IsOptional()
    codigo_de_autor: string;
  
    @IsOptional()
    nombre: string;
  
  }
  

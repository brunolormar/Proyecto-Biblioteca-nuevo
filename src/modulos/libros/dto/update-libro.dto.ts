import { PartialType } from '@nestjs/mapped-types';
import { CreateLibroDto } from './create-libro.dto';
import { IsOptional } from 'class-validator';

export class UpdateLibroDto extends PartialType(CreateLibroDto) {
    @IsOptional()
    id: number;
  
    @IsOptional()
    autor_id: string;
  
    @IsOptional()
    titulo: string;
  
    @IsOptional()
    isbn: string;
  
    @IsOptional()
    fecha_de_publicacion: string;
  
    @IsOptional()
    editorial: string;
  
    @IsOptional()
    numero_de_paginas: number;
  
    @IsOptional()
    serie: string;
  
    @IsOptional()
    clasificacion: string;
  
    @IsOptional()
    estado: string;
  
    @IsOptional()
    situacion: string;
  }
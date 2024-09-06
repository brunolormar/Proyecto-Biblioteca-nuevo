import { IsIn, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateLibroDto {

    @IsNumber()
    @IsPositive()
    id: number;

    @IsString()
    @MinLength(2)
    autor_id: string;

    @IsString()
    @MinLength(2)
    titulo: string;

    @IsString()
    @MinLength(13)
    isbn: string;

    @IsString()
    fecha_de_publicacion: string;

    @IsString()
    @MinLength(2)
    editorial: string;

    @IsNumber()
    @IsPositive()
    numero_de_paginas: number;

    @IsString()
    @IsOptional()
    serie?: string;
    
    @IsString()
    @IsIn(['infantil', 'juvenil', 'adulto'])
    clasificacion: string;

    @IsString()
    @IsIn(['en catalogo', 'descatalogado'])
    estado: string;

    @IsString()
    @IsIn(['libre', 'prestado'])
    situacion: string;

    @IsString()
    @IsOptional()
    portada?: string;
}

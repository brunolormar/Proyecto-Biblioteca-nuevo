import { IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateSocioDto {

    @IsNumber()
    @IsPositive()
    numero_de_socio: number;

    @IsString()
    @MinLength(2)
    nombre: string;

    @IsString()
    @MinLength(2)
    apellidos: string;

    @IsString()
    @MinLength(2)
    direccion: string;

    @IsString()
    @MinLength(2)
    DNI: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    numero_de_telefono?: number;

}

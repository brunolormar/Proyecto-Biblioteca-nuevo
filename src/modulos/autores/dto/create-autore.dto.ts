import { IsString, MinLength } from "class-validator";

export class CreateAutoreDto {

    @IsString()
    @MinLength(2)
    codigo_de_autor: string;

    @IsString()
    @MinLength(2)
    nombre: string;

}

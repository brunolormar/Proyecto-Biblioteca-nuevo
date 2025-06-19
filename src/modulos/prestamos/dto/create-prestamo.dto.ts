import { IsIn, IsNumber, IsPositive, IsString, MinLength } from "class-validator";

export class CreatePrestamoDto {

    @IsNumber()
    @IsPositive()
    libro_id: number;

    @IsString()
    usuario_id: string;

    @IsString()
    fecha_del_prestamo: string;

    @IsString()
    fecha_limite_a_devolver: string;

    @IsString()
    @IsIn(['en curso', 'terminado'])
    estado_del_prestamo: string;
}

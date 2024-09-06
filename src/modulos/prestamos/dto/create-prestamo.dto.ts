import { IsIn, IsNumber, IsPositive, IsString, MinLength } from "class-validator";

export class CreatePrestamoDto {

    @IsNumber()
    @IsPositive()
    libro_id: number;

    @IsNumber()
    @IsPositive()
    socio_id: number;

    @IsString()
    fecha_del_prestamo: string;

    @IsString()
    fecha_limite_a_devolver: string;

    @IsString()
    @IsIn(['en curso', 'terminado'])
    estado_del_prestamo: string;
}

import { IsIn, IsString } from "class-validator";

export class CreateUserDto {

    @IsString()
    email: string;

    @IsString()
    username: string;

    @IsString()
    password: string;
    
    /*@IsString()
    @IsIn(['invitado', 'usuario', 'gestor', 'administrador'])
    roles: string;*/
}
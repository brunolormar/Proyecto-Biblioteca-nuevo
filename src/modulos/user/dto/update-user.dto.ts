import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    email: string;
  
    @IsOptional()
    username: string;
  
    @IsOptional()
    password: string;
  
    @IsOptional()
    direccion: string;
  
    @IsOptional()
    DNI: string;
  
    @IsOptional()
    numero_de_telefono: number;
}

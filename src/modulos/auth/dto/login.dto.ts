import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { RegisterAuthDto } from './register.dto';

export class LoginAuthDto {
    @IsEmail({}, {
        message: 'Invalid email'
    })
    @IsNotEmpty({
        message: 'email is required'
    })
    email: string;

    @IsString({
        message: 'Invalid password'
    })
    @IsNotEmpty({
        message: 'password is required'
    })
    @MinLength(6)
    @MaxLength(50)
    @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;
}
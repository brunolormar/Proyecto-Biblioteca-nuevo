import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login.dto';
import { RegisterAuthDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //login
  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto){
    console.log(loginAuthDto)
    return this.authService.login(loginAuthDto);
  }

  //register
  @Post('register')
  register(@Body() registerdto: RegisterAuthDto){
    console.log(registerdto)
    return this.authService.register(registerdto);
  }

  //logout

  //checktoken

  //perfil

  @Get('validate-token')
  @UseGuards(AuthGuard('jwt'))
  validateToken(@Req() req) {
    return {
      user: req.user,
    };
  }
}


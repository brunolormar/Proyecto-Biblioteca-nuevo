import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../user/entities/user.repository';
import { RegisterAuthDto } from "./dto/register.dto";
import { LoginAuthDto } from "./dto/login.dto";
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(private readonly userRepository: UserRepository,
              /*private readonly rolRepository: RolRepository,*/
              private readonly jwtService: JwtService
  ){}

  async login(loginDto: LoginAuthDto){
    const usuario = await this.userRepository.findByEmail(loginDto.email);
    if (!usuario){
      throw new NotFoundException('Usuario no existe')
    }
    let isValidPassword;
    try{
      isValidPassword = await this.isMatch(loginDto.password, usuario.password)
      //bcrypt.compare(loginDto.password, usuario.password)
    }catch(error){
      throw new InternalServerErrorException('error validator password')
    }
    if (isValidPassword){
      //return 'Login success'
      return {
        msg: 'Usuario validando',
        status: 200,
        //user: usuario,
        token: this.getAccessToken(usuario)
      }
    }else{
      return 'Login not success'
    }
  }

  async register(registerDto: RegisterAuthDto){
    console.log(registerDto)
      //const { username, email, password } = registerDto; //operador destructuracion
      //const { email, ...resto } = registerDto; // ... operador spread

      if (await this.userRepository.findByEmail(registerDto.email)){
        throw new BadRequestException('El email existe en la Base de Datos')
        //ABORTA la funcion register y NO CONTINUA
      }
      if (await this.userRepository.findByUsername(registerDto.username)){
        throw new BadRequestException('El username existe en la Base de Datos')
        //ABORTA la funcion register y NO CONTINUA
      }

      console.log('el email ', registerDto.email, ' no existe en la BD');
      try{
        registerDto.password = await this.getHash(registerDto.password);
        return this.userRepository.save(registerDto);
      } catch(error){
          throw new InternalServerErrorException('Error al buscar el email');
      }
    }
  
    async getHash (password: string){
      return await bcrypt.hash(password, 10);
    }

    async isMatch (password: string, hash: string){
      return await bcrypt.compare(password, hash);
    }

    private getAccessToken(user: User){
      //console.log(user);
      //console.log(process.env.JWT_SECRET)

    try{
      //crea el token con los campos del user seleccionados
      //y la configuración del JwtModule.register()
      const accessToken = this.jwtService.sign({
        id: user.id,
        name: user.username,
        email: user.email,
        //rol: user.roles[0],
         //create: user.createsAt
      });
      return accessToken
      
    } catch(error){
      console.log(error);
      throw new InternalServerErrorException('Error al crear el token');
    }
  }
}

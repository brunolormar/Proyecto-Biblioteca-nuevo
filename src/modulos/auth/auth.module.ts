import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/entities/user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository
    ]),
    PassportModule.register({ defaultStrategy:'jwt'}),
    //configuramos el JWT
    // JwtModule.register({
    //   //privateKey: PRIVATE_KEY,
    //   //publicKey: PUBLIC_KEY,
    //   secret:'claveSecreta123',
    //   signOptions:{
    //     expiresIn: '1h',
    //     algorithm: 'HS256'
    //  }
    //})
    //debido a la espera de leer el fichero .env
    JwtModule.registerAsync({
      imports:[ ConfigModule ],
      inject:[ ConfigService ],
      useFactory: ( configService: ConfigService ) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h',
            algorithm: 'HS256'
          }
        }
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, /*RolRepository, JwtStrategy*/],
})
export class AuthModule {
  constructor(){
    //console.log(PUBLIC_KEY, PRIVATE_KEY)
  }
}


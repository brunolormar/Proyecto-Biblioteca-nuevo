import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "src/modulos/user/entities/user.entity";
import { privateDecrypt } from "crypto";
import { Passport } from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "src/modulos/user/entities/user.repository";

//Le pasamos la estrategia Strategy definida en passport-jwt
//contiene las operaciones para desencriptar el token jwt y extraer la info
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        // private UserRepository: UserRepository,
        private readonly configService: ConfigService
    ){
        //configuraciones
        super({ 
            //obtiene el token jwt de la Request
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, //rechaza un token pasado de tiempo
            secretOrKey: configService.get('JWT_SECRET')
        
        })
    }
    //creamos un método validate, que valida el payload del token y que es compatible
    //con la estructura de la entidad User
    async validate(payload: User){
        console.log(payload)

        //devolvemos los campos deseados del payload
        return {
            id: payload.id,
            name: payload.username,
            email: payload.email,
        }
    }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutoresModule } from './modulos/autores/autores.module';
import { LibrosModule } from './modulos/libros/libros.module';
import { PrestamosModule } from './modulos/prestamos/prestamos.module';
import { SociosModule } from './modulos/socios/socios.module';
import { SeedModule } from './modulos/seed/seed.module';
import { AuthModule } from './modulos/auth/auth.module';
import { UserModule } from './modulos/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true
    }),
    AutoresModule,
    LibrosModule,
    PrestamosModule,
    SociosModule,
    SeedModule,
    AuthModule,
    UserModule

  ],  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

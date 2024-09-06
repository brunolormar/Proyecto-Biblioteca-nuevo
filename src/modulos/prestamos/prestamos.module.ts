import { Module } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';
import { PrestamosController } from './prestamos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestamo } from './entities/prestamo.entity';
import { LibrosModule } from '../libros/libros.module';
import { SociosModule } from '../socios/socios.module';

@Module({
  controllers: [PrestamosController],
  providers: [PrestamosService],
  imports: [
    LibrosModule, 
    SociosModule,
    TypeOrmModule.forFeature([Prestamo])
  ],
  exports: [ PrestamosService, TypeOrmModule]
})
export class PrestamosModule {}

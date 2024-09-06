import { Module } from '@nestjs/common';
import { LibrosService } from './libros.service';
import { LibrosController } from './libros.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Libro } from './entities/libro.entity';
import { AutoresModule } from '../autores/autores.module';

@Module({
  controllers: [LibrosController],
  providers: [LibrosService],
  imports: [
    AutoresModule,
    TypeOrmModule.forFeature([Libro])
  ],
  exports: [ LibrosService, TypeOrmModule]
})
export class LibrosModule {}

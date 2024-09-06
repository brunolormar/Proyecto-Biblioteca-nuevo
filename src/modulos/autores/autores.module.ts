import { Module } from '@nestjs/common';
import { AutoresService } from './autores.service';
import { AutoresController } from './autores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Autore } from './entities/autore.entity';

@Module({
  controllers: [AutoresController],
  providers: [AutoresService],
  imports: [
    TypeOrmModule.forFeature([Autore])
  ],
  exports: [ AutoresService, TypeOrmModule]
})
export class AutoresModule {}


import { Module } from '@nestjs/common';
import { SociosService } from './socios.service';
import { SociosController } from './socios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Socio } from './entities/socio.entity';

@Module({
  controllers: [SociosController],
  providers: [SociosService],
  imports: [
    TypeOrmModule.forFeature([Socio])
  ],
  exports: [ SociosService, TypeOrmModule]
})
export class SociosModule {}

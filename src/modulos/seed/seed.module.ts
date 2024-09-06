import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AutoresModule } from '../autores/autores.module';
import { LibrosModule } from '../libros/libros.module';
import { PrestamosModule } from '../prestamos/prestamos.module';
import { SociosModule } from '../socios/socios.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ AutoresModule, LibrosModule, PrestamosModule, SociosModule ]
})
export class SeedModule {}


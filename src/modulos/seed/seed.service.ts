import { Injectable } from '@nestjs/common';
import { AutoresService } from '../autores/autores.service';
import * as seedAutores from '../seed/data/autores.json'
import * as seedLibros from '../seed/data/libros.json'
import * as seedPrestamos from '../seed/data/prestamos.json'
import * as seedSocios from '../seed/data/socios.json'
import { Autor } from '../autores/interfaces/autor.interface';
import { LibrosService } from '../libros/libros.service';
import { PrestamosService } from '../prestamos/prestamos.service';
import { SociosService } from '../socios/socios.service';
import { Libro } from '../libros/interfaces/libro.interface';
import { Prestamo } from '../prestamos/interfaces/prestamo.interface';
import { Socio } from '../socios/interfaces/socio.interface';

@Injectable()
export class SeedService {
  constructor (private readonly autoreService: AutoresService,
               private readonly libroService: LibrosService,
               private readonly prestamoService: PrestamosService,
               private readonly socioService: SociosService){}
  
  public loadData(){
    seedAutores.forEach(( autor: Autor ) => {
      console.log(autor.nombre);
    })
    seedLibros.forEach(( libro: Libro ) => {
      console.log(libro.titulo);
    })
    seedPrestamos.forEach(( prestamo: Prestamo ) => {
      console.log(prestamo.fecha_limite_a_devolver);
    })
    seedSocios.forEach(( socio: Socio ) => {
      console.log(socio.nombre);
    })
    return {
      msg: 'Carga de datos finalizada'
    }
  }
}


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
  
  public async loadData(){
    await this.insertNewAutores();
    await this.insertNewLibros();
    await this.insertNewPrestamos();
    await this.insertNewSocios();
  }

  private async insertNewAutores(){
    await this.autoreService.deleteAllAutores();
    const insertPromisesAutores = [];
    seedAutores.forEach( (autor: Autor) => {
      insertPromisesAutores.push(this.autoreService.create(autor));      
    });
    const results = await Promise.all(insertPromisesAutores);
    return true;
  }

  private async insertNewLibros(){
    await this.libroService.deleteAllLibros();
    const insertPromisesLibros = [];
    seedLibros.forEach( (libro: Libro) => {
      insertPromisesLibros.push(this.libroService.create(libro));      
    });
    const results = await Promise.all(insertPromisesLibros);
    return true;
  }

  private async insertNewPrestamos(){
    await this.prestamoService.deleteAllPrestamos();
    const insertPromisesPrestamos = [];
    seedPrestamos.forEach( (prestamo: Prestamo) => {
      insertPromisesPrestamos.push(this.prestamoService.create(prestamo));      
    });
    const results = await Promise.all(insertPromisesPrestamos);
    return true;
  }

  private async insertNewSocios(){
    await this.socioService.deleteAllSocios();
    const insertPromisesSocios = [];
    seedSocios.forEach( (socio: Socio) => {
      insertPromisesSocios.push(this.socioService.create(socio));      
    });
    const results = await Promise.all(insertPromisesSocios);
    return true;
  }
}


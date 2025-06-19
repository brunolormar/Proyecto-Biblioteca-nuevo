import { Injectable } from '@nestjs/common';
import { AutoresService } from '../autores/autores.service';
import * as seedAutores from '../seed/data/autores.json'
import * as seedLibros from '../seed/data/libros.json'
import * as seedPrestamos from '../seed/data/prestamos.json'
import * as seedUsers from '../seed/data/users.json'
import { Autor } from '../autores/interfaces/autor.interface';
import { LibrosService } from '../libros/libros.service';
import { PrestamosService } from '../prestamos/prestamos.service';
import { Libro } from '../libros/interfaces/libro.interface';
import { Prestamo } from '../prestamos/interfaces/prestamo.interface';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import * as fs from 'fs';

type RawUser = {
  custom_id: string;
  email: string;
  password: string;
  username: string;
};
@Injectable()
export class SeedService {
  constructor (private readonly autoreService: AutoresService,
               private readonly libroService: LibrosService,
               private readonly prestamoService: PrestamosService,
               private readonly userService: UserService){}
  
  public async loadData(){
    await this.insertNewAutores();
    await this.insertNewLibros();
    await this.insertNewUsers()
    await this.insertNewPrestamos();
  }

  private async insertNewAutores(){
    await this.autoreService.deleteAllAutores();
    for (const autor of seedAutores) {
      await this.autoreService.create(autor);
    }
    console.log('Autores insertados correctamente');
    return true;
  }

  private async insertNewLibros(){
    await this.libroService.deleteAllLibros();
    for (const libro of seedLibros) {
      await this.libroService.create(libro);
    }
    console.log('Libros insertados correctamente');
    return true;
  }

  private async insertNewUsers(){
    await this.userService.deleteAllUsers();
    for (const user of seedUsers) {
      await this.userService.create(user);
    }
    console.log('Usuarios insertados correctamente');
    return true;
  }

  private async insertNewPrestamos() {
    await this.prestamoService.deleteAllPrestamos();

    // Leer el mapa custom_id => UUID generado
    const userIdMap: Record<string, string> = JSON.parse(
      fs.readFileSync('src/modulos/seed/data/user-id-map.json', 'utf-8')
    );

    const insertPromisesPrestamos = [];

    for (const prestamo of seedPrestamos) {
      const uuidUsuario = userIdMap[prestamo.usuario_id];  // convertir el ID antiguo

      if (!uuidUsuario) {
        console.warn(`Usuario con custom_id ${prestamo.usuario_id} no existe en el mapa. Prestamo ignorado.`);
        continue;
      }

      const user = await this.userService.findOne(uuidUsuario);
      if (!user) {
        console.warn(`Usuario con id ${uuidUsuario} no existe. Prestamo ignorado.`);
        continue;
      }

      const libro = await this.libroService.findOne(prestamo.libro_id);
      if (!libro) {
        console.warn(`Libro con id ${prestamo.libro_id} no existe. Prestamo ignorado.`);
        continue;
      }

      insertPromisesPrestamos.push(
        this.prestamoService.create({
          ...prestamo,
          usuario_id: uuidUsuario // usar el ID real
        })
      );
    }

    await Promise.all(insertPromisesPrestamos);
    return true;
  }
}


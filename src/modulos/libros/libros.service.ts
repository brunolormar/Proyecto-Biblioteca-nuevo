import { BadRequestException, Body, Injectable, InternalServerErrorException, NotFoundException, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Libro } from './entities/libro.entity';
import { Repository } from 'typeorm';
import { AutoresService } from '../autores/autores.service';
import * as fs from 'fs';
import { Autore } from 'src/modulos/autores/entities/autore.entity';
import { Prestamo } from '../prestamos/entities/prestamo.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class LibrosService {
  constructor(
    @InjectRepository(Libro)
    private readonly libroRepository: Repository<Libro>,
    private autoresService: AutoresService,

    @InjectRepository(Autore)
    private readonly autorRepository: Repository<Autore>,

    private dataSource: DataSource,
  ) {}

  async onModuleInit() {
    await this.loadLibrosFromFile();
  }

  async loadLibrosFromFile(): Promise<void> {
    try {
      const data = fs.readFileSync('src/modulos/seed/data/libros.json', 'utf-8');
      const libros = JSON.parse(data);

      const libroEntities = libros.map((libro) =>
        this.libroRepository.create(libro),
      );

      const existingLibros = await this.libroRepository.count();
      if (existingLibros === 0) {
        await this.libroRepository.save(libroEntities);
        console.log('Datos de libros volcados correctamente.');
      } else {
        console.log('La tabla de libros ya contiene datos, no se volcaron nuevos.');
      }
    } catch (error) {
      console.error('Error al volcar los datos de libros:', error);
    }
  }

  @Post()
  async create(createLibroDto: CreateLibroDto) {
    try {
      const {autor_id, ...campos } = createLibroDto;
      const libro = this.libroRepository.create({...campos});
      const autorobj = await this.autoresService.findOne(autor_id);
      libro.autor = autorobj; //direccion del objeto autor relacionado
      console.log(libro);
      await this.libroRepository.save(libro);

      return {
        status: 200,
        data: libro,
        msg: 'Libro insertado correctamente'
      }  
    }catch(error){
      console.log(error);
      throw new InternalServerErrorException('Pongase en contacto con el Sysadmin')
    }
  }
  
  findAll() {
    const libro = this.libroRepository.find(/*{
      relations: {
        autor: true
      }
    }*/);
    return libro;
  }

  findOne(id: number) {
    const libro= this.libroRepository.findOne({
      where:{
        id
      },
      /*relations: {
        autor: true
      }*/
    });
    return libro;
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() libroDto: UpdateLibroDto) {
    try {
      const libro = await this.libroRepository.findOne({
        where: { id },
        relations: ['autor'],
      });

      if (!libro) {
        throw new NotFoundException(`Libro con id ${id} no encontrado`);
      }

      if (libroDto.autor_id) {
        const autor = await this.autorRepository.findOne({ where: { codigo_de_autor: libroDto.autor_id } });

        if (!autor) {
          throw new NotFoundException(`Autor con código ${libroDto.autor_id} no encontrado`);
        }

        // Asignar el objeto autor al campo relacional
        libro.autor = autor;
        libro.autor_id = libroDto.autor_id;
      }

      /*console.log('Libro original:', libro);
      console.log('DTO recibido:', libroDto);*/

      // Forzar el update manualmente
      const libroActualizado = this.libroRepository.create({
        ...libro,
        ...libroDto,
        id: libro.id, // asegurar que no se sobreescriba el ID
      });

      const resultado = await this.libroRepository.save(libroActualizado);
      return resultado;
    } catch (error) {
      console.error('Error actualizando libro:', error);
      throw new InternalServerErrorException('Error actualizando libro');
    }
  }

  async remove(id: number) {
    try {
      // Verificar si existen préstamos relacionados con este libro
      const prestamos = await this.dataSource.getRepository(Prestamo).find({
        where: { libro: { id } },
      });

      if (prestamos.length > 0) {
        throw new BadRequestException('No se puede eliminar el libro porque tiene préstamos asociados.');
      }
      
      const result = await this.libroRepository.delete(id);
      return{
        msg: 'Registro borrado',
        status: 200
      }
    }catch(error){
      console.log(error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Pongase en contacto con el Sysadmin')
    }
  }

  async deleteAllLibros(){
    const query = this.libroRepository.createQueryBuilder('libro');
    try{
      return await query
        .delete()
        .where({})
        .execute()
    }catch(error){
      throw new InternalServerErrorException('sysadmin ...')
    }
  }

  async getClasificacion(clasificacion: string){
    console.log(clasificacion)
    return await this.libroRepository
    .createQueryBuilder("libro")
    .select("DISTINCT libro.clasificacion",clasificacion)
    .orderBy("libro.clasificacion", "ASC")
    .getRawMany();
  }

  async getClasificaciones(){
    return await this.libroRepository
    .createQueryBuilder("libro")
    .select("DISTINCT libro.clasificacion")
    .orderBy("libro.clasificacion", "ASC")
    .getRawMany();
  }

  async getSituacion(situacion: string){
    console.log(situacion)
    return await this.libroRepository
    .createQueryBuilder("libro")
    .select("DISTINCT libro.situacion",situacion)
    .orderBy("libro.situacion", "ASC")
    .getRawMany();
  }

  async getSituaciones(){
    return await this.libroRepository
    .createQueryBuilder("libro")
    .select("DISTINCT libro.situacion")
    .orderBy("libro.situacion", "ASC")
    .getRawMany();
  }

  async getEstado(estado: string){
    console.log(estado)
    return await this.libroRepository
    .createQueryBuilder("libro")
    .select("DISTINCT libro.estado",estado)
    .orderBy("libro.estado", "ASC")
    .getRawMany();
  }

  async getEstados(){
    return await this.libroRepository
    .createQueryBuilder("libro")
    .select("DISTINCT libro.estado")
    .orderBy("libro.estado", "ASC")
    .getRawMany();
  }

  async getNombreautor(autor_id: string){
    console.log(autor_id)
    return await this.libroRepository
    .createQueryBuilder("libro")
    .select("DISTINCT libro.autor_id",autor_id)
    .orderBy("libro.autor_id", "ASC")
    .getRawMany();
  }

 async getNombreautores() {
  return await this.libroRepository
    .createQueryBuilder("libro")
    .leftJoin("libro.autor", "autor") // Usa la relación definida en la entidad Libro
    .select([
      "DISTINCT autor.codigo_de_autor AS codigo_de_autor",
      "autor.nombre AS nombre"
    ])
    .orderBy("autor.nombre", "ASC")
    .getRawMany();
}

  async getEditoriales() {
    const result = await this.libroRepository
    .createQueryBuilder("libro")
    .select("DISTINCT libro.editorial", "editorial")
    .orderBy("libro.editorial", "ASC")
    .getRawMany();

    // Devuelve solo los valores (no objetos con `{ editorial: string }`)
    return result.map((row) => row.editorial).filter((e) => !!e);
  }

  async getSeries() {
    const result = await this.libroRepository
    .createQueryBuilder("libro")
    .select("DISTINCT libro.serie", "serie")
    .orderBy("libro.serie", "ASC")
    .getRawMany();

    // Devuelve solo los valores (no objetos con `{ serie: string }`)
    return result.map((row) => row.serie).filter((e) => !!e);
  }

  async getTitulos() {
    const result = await this.libroRepository
    .createQueryBuilder("libro")
    .select("DISTINCT libro.titulo", "titulo")
    .orderBy("libro.titulo", "ASC")
    .getRawMany();

    // Devuelve solo los valores (no objetos con `{ titulo: string }`)
    return result.map((row) => row.titulo).filter((e) => !!e);
  }
}

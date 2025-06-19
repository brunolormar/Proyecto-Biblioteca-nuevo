import { Injectable, InternalServerErrorException, Patch, Post } from '@nestjs/common';
import { CreateAutoreDto } from './dto/create-autore.dto';
import { UpdateAutoreDto } from './dto/update-autore.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Autore } from './entities/autore.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { Like } from 'typeorm';
@Injectable()
export class AutoresService {
  constructor(
    @InjectRepository(Autore)
    private readonly autorRepository: Repository<Autore>
  ) {}

  async onModuleInit() {
    await this.loadAutoresFromFile();
  }

  async loadAutoresFromFile(): Promise<void> {
    try {
      const data = fs.readFileSync('src/modulos/seed/data/autores.json', 'utf-8');
      const autores = JSON.parse(data);

      const autorEntities = autores.map((autor) =>
        this.autorRepository.create(autor),
      );

      const existingAutores = await this.autorRepository.count();
      if (existingAutores === 0) {
        await this.autorRepository.save(autorEntities);
        console.log('Datos de autores volcados correctamente.');
      } else {
        console.log('La tabla de autores ya contiene datos, no se volcaron nuevos.');
      }
    } catch (error) {
      console.error('Error al volcar los datos de autores:', error);
    }
  }

  @Post()
  async create(createAutoreDto: CreateAutoreDto) {
    try {
      const autor = this.autorRepository.create(createAutoreDto);
      await this.autorRepository.save(autor);
      return{
        msg: 'Registro Insertado',
        data: autor,
        status: 200
      }
    }catch(error){
      console.log(error);
      throw new InternalServerErrorException('Pongase en contacto con el Sysadmin')
    }
  }

  findAll() {
    const autor = this.autorRepository.find();
    return autor;
  }

  findOne(codigo_de_autor: string) {
    const autor= this.autorRepository.findOne({
      where:{
        codigo_de_autor
      },
      relations: {
        libros: true
      }
    });
    return autor;
  }

  @Patch()
  async update(codigo_de_autor: string, updateAutoreDto: UpdateAutoreDto) {
    try {
      const autor = await this.autorRepository.findOne({
        where:{
          codigo_de_autor
        }
      });

      // Update the libro entity with new values
      Object.assign(autor, updateAutoreDto);

      await this.autorRepository.save(autor);
      return{
        msg: 'Registro Actualizado',
        data: autor,
        status: 200
      }
    }catch(error){
      console.log(error);
      throw new InternalServerErrorException('Pongase en contacto con el Sysadmin')
    } 
  }

  async remove(id: string) {
    try {
      // Verifica si el autor tiene libros asociados
      const autor = await this.autorRepository.findOne({
        where: { codigo_de_autor: id },
        relations: { libros: true }
      });

      if (autor.libros && autor.libros.length > 0) {
        return {
          msg: 'No se puede eliminar el autor porque tiene libros asociados',
          status: 400
        };
      }

      await this.autorRepository.delete(id)

      const result = await this.autorRepository.delete(id);
      return{
        msg: 'Registro borrado',
        status: 200
      }
    }catch(error){
      console.log(error);
      throw new InternalServerErrorException('Pongase en contacto con el Sysadmin')
    }
  }

  async deleteAllAutores(){
    const query = this.autorRepository.createQueryBuilder('autor');
    try{
      return await query
        .delete()
        .where({})
        .execute()
    }catch(error){
      throw new InternalServerErrorException('sysadmin ...')
    }
  }

  async buscarPorIdParcial(parcial: string): Promise<{ id: string; nombre: string }[]> {
    const resultados = await this.autorRepository.find({
      where: {
        codigo_de_autor: Like(`${parcial}%`),
      },
      select: ['codigo_de_autor', 'nombre'], // Seleccionamos solo lo necesario
      take: 10,
      order: { codigo_de_autor: 'ASC' },
    });
  
    // Mapear al formato esperado por el frontend
    return resultados.map(autor => ({
      id: autor.codigo_de_autor,
      nombre: autor.nombre,
    }));
  }

  async getNombres() {
    const result = await this.autorRepository
    .createQueryBuilder("autor")
    .select("DISTINCT autor.nombre", "nombre")
    .orderBy("autor.nombre", "ASC")
    .getRawMany();

    // Devuelve solo los valores (no objetos con `{ nombre: string }`)
    return result.map((row) => row.nombre).filter((e) => !!e);
  }
}

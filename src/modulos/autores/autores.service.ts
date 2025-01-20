import { Injectable, InternalServerErrorException, Patch, Post } from '@nestjs/common';
import { CreateAutoreDto } from './dto/create-autore.dto';
import { UpdateAutoreDto } from './dto/update-autore.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Autore } from './entities/autore.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
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
}

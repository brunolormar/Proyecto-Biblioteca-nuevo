import { Injectable, InternalServerErrorException, Patch, Post } from '@nestjs/common';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Libro } from './entities/libro.entity';
import { Repository } from 'typeorm';
import { AutoresService } from '../autores/autores.service';

@Injectable()
export class LibrosService {
  constructor(
    @InjectRepository(Libro)
    private readonly libroRepository: Repository<Libro>,
    private autoresService: AutoresService
  ) {}

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

  @Patch()
  async update(id: number, updateLibroDto: UpdateLibroDto) {
    try {
      const libro = await this.libroRepository.findOne({
        where:{
          id
        }
      });

      // Update the libro entity with new values
      Object.assign(libro, updateLibroDto);

      await this.libroRepository.save(libro);
      return{
        msg: 'Registro Actualizado',
        data: libro,
        status: 200
      }
    }catch(error){
      console.log(error);
      throw new InternalServerErrorException('Pongase en contacto con el Sysadmin')
    } 
  }

  async remove(id: number) {
    try {
      const result = await this.libroRepository.delete(id);
      return{
        msg: 'Registro borrado',
        status: 200
      }
    }catch(error){
      console.log(error);
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
}

import { Injectable, InternalServerErrorException, NotFoundException, Patch, Post } from '@nestjs/common';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prestamo } from './entities/prestamo.entity';
import { LibrosService } from '../libros/libros.service';
import { SociosService } from '../socios/socios.service';

@Injectable()
export class PrestamosService {
  constructor(
    @InjectRepository(Prestamo)
    private readonly prestamoRepository: Repository<Prestamo>,
    private librosService: LibrosService,
    private sociosService: SociosService
  ) {}

  @Post()
  async create(createPrestamoDto: CreatePrestamoDto) {
    try {
      const {libro_id, socio_id, ...campos } = createPrestamoDto;
      //const prestamo = this.prestamoRepository.create({...campos});
      const libroobj = await this.librosService.findOne(libro_id);
      const socioobj = await this.sociosService.findOne(socio_id);
      //prestamo.libro = libroobj; //direccion del objeto autor relacionado
      const prestamo = this.prestamoRepository.create({
        ...campos,
        libro: libroobj,
        socio: socioobj
      });
      console.log(prestamo);
      await this.prestamoRepository.save(prestamo);

      return {
        status: 200,
        data: prestamo,
        msg: 'Libro insertado correctamente'
      }  
    }catch(error){
      console.log(error);
      throw new InternalServerErrorException('Pongase en contacto con el Sysadmin')
    }
  }

  findAll() {
    const prestamo = this.prestamoRepository.find(/*{
      relations: {
        autor: true
      }
    }*/);
    return prestamo;
  }

  findOne(libro_id: number, socio_id: number, fecha_del_prestamo: string) {
    const prestamo= this.prestamoRepository.findOne({
      where:{
        libro_id, socio_id, fecha_del_prestamo
      },
      /*relations: {
        autor: true
      }*/
    });
    return prestamo;
  }

  @Patch()
  async update(libro_id: number, socio_id: number, fecha_del_prestamo: string, updatePrestamoDto: UpdatePrestamoDto) {
    try {
      const prestamo = await this.prestamoRepository.findOne({
        where:{
          libro_id, socio_id, fecha_del_prestamo
        }
      });

      // Update the libro entity with new values
      Object.assign(prestamo, updatePrestamoDto);

      await this.prestamoRepository.save(prestamo);
      return{
        msg: 'Registro Actualizado',
        data: prestamo,
        status: 200
      }
    }catch(error){
      console.log(error);
      throw new InternalServerErrorException('Pongase en contacto con el Sysadmin')
    } 
  }

  async remove(libro_id: number, socio_id: number, fecha_del_prestamo: string) {
    try {
      const result = await this.prestamoRepository.delete({
        libro_id, socio_id, fecha_del_prestamo
      });

      if (result.affected === 0) {
        throw new NotFoundException(`Prestamo with libro_id ${libro_id}, socio_id ${socio_id}, fecha_del_prestamo ${fecha_del_prestamo} not found`);
      }
      
      return{
        msg: 'Registro borrado',
        status: 200
      }
    }catch(error){
      console.log(error);
      throw new InternalServerErrorException('Pongase en contacto con el Sysadmin')
    }
  }


  async deleteAllPrestamos(){
    const query = this.prestamoRepository.createQueryBuilder('prestamo');
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


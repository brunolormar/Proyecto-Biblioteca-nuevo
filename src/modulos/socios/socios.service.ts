import { Injectable, InternalServerErrorException, Patch, Post } from '@nestjs/common';
import { CreateSocioDto } from './dto/create-socio.dto';
import { UpdateSocioDto } from './dto/update-socio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Socio } from './entities/socio.entity';

@Injectable()
export class SociosService {
  constructor(
    @InjectRepository(Socio)
    private readonly socioRepository: Repository<Socio>
  ) {}

  @Post()
  async create(createSocioDto: CreateSocioDto) {
    try {
      const socio = this.socioRepository.create(createSocioDto);
      await this.socioRepository.save(socio);
      return{
        msg: 'Registro Insertado',
        data: socio,
        status: 200
      }
    }catch(error){
      console.log(error);
      throw new InternalServerErrorException('Pongase en contacto con el Sysadmin')
    }
  }

  findAll() {
    const socio = this.socioRepository.find();
    return socio;
  }

  findOne(numero_de_socio: number) {
    const socio= this.socioRepository.findOne({
      where:{
        numero_de_socio
      }
    });
    return socio;
  }


  @Patch()
  async update(numero_de_socio: number, updateSocioDto: UpdateSocioDto) {
    try {
      const socio = await this.socioRepository.findOne({
        where:{
          numero_de_socio
        }
      });

      // Update the libro entity with new values
      Object.assign(socio, updateSocioDto);

      await this.socioRepository.save(socio);
      return{
        msg: 'Registro Actualizado',
        data: socio,
        status: 200
      }
    }catch(error){
      console.log(error);
      throw new InternalServerErrorException('Pongase en contacto con el Sysadmin')
    } 
  }


  async remove(id: number) {
    try {
      const result = await this.socioRepository.delete(id);
      return{
        msg: 'Registro borrado',
        status: 200
      }
    }catch(error){
      console.log(error);
      throw new InternalServerErrorException('Pongase en contacto con el Sysadmin')
    }
  }

  async deleteAllSocios(){
    const query = this.socioRepository.createQueryBuilder('socio');
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


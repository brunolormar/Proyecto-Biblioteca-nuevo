import { Injectable, InternalServerErrorException, NotFoundException, Patch, Post } from '@nestjs/common';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prestamo } from './entities/prestamo.entity';
import { LibrosService } from '../libros/libros.service';
import { UserService } from '../user/user.service';
import * as fs from 'fs';

@Injectable()
export class PrestamosService {
  constructor(
    @InjectRepository(Prestamo)
    private readonly prestamoRepository: Repository<Prestamo>,
    private librosService: LibrosService,
    private userService: UserService
  ) {}

  async onModuleInit() {
    await this.loadPrestamosFromFile();
  }

  async loadPrestamosFromFile(): Promise<void> {
    try {
      const data = fs.readFileSync('src/modulos/seed/data/prestamos.json', 'utf-8');
      const prestamos = JSON.parse(data);

      // Cargar el mapa legacyId -> uuid generado por loadUsersFromFile()
      const idMap = JSON.parse(fs.readFileSync('src/modulos/seed/data/user-id-map.json', 'utf-8'));

      const prestamoEntities = prestamos.map((prestamo) => {
        const realUuid = idMap[prestamo.usuario_id];
        if (!realUuid) {
          throw new Error(`No se encontró UUID para usuario_id "${prestamo.usuario_id}"`);
        }

        return this.prestamoRepository.create({
          ...prestamo,
          usuario_id: realUuid,
        });
      });


      const existingPrestamos = await this.prestamoRepository.count();
      if (existingPrestamos === 0) {
        await this.prestamoRepository.save(prestamoEntities);
        console.log('Datos de prestamos volcados correctamente.');
      } else {
        console.log('La tabla de prestamos ya contiene datos, no se volcaron nuevos.');
      }
    } catch (error) {
      console.error('Error al volcar los datos de prestamos:', error);
    }
  }

  @Post()
  async create(createPrestamoDto: CreatePrestamoDto) {
    try {
      const {libro_id, usuario_id, ...campos } = createPrestamoDto;
      //const prestamo = this.prestamoRepository.create({...campos});
      const libroobj = await this.librosService.findOne(libro_id);
      const usuarioobj = await this.userService.findOne(usuario_id);
      //prestamo.libro = libroobj; //direccion del objeto autor relacionado
      const prestamo = this.prestamoRepository.create({
        ...campos,
        libro: libroobj,
        usuario: usuarioobj
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
    const prestamos = this.prestamoRepository.find({
      relations: ['usuario', 'libro'],
    });
    return prestamos;
  }

  findOne(libro_id: number, usuario_id: string, fecha_del_prestamo: string) {
    const prestamo= this.prestamoRepository.findOne({
      where:{
        libro_id, usuario_id, fecha_del_prestamo
      },
      /*relations: {
        autor: true
      }*/
    });
    return prestamo;
  }

  @Patch()
  async update(
    libro_id: number,
    usuario_id: string,
    fecha_del_prestamo: string,
    updatePrestamoDto: UpdatePrestamoDto
  ) {
    try {
      const prestamo = await this.prestamoRepository.findOne({
        where: {
          libro_id,
          usuario_id,
          fecha_del_prestamo,
        },
        relations: ['libro', 'usuario'], // opcional pero recomendable si necesitas los objetos completos
      });

      if (!prestamo) {
        throw new NotFoundException('Préstamo no encontrado');
      }

      console.log('Préstamo original:', prestamo);
      console.log('DTO recibido:', updatePrestamoDto);

      // Crear nueva entidad fusionada (para prevenir que TypeORM haga un INSERT)
      const prestamoActualizado = this.prestamoRepository.create({
        ...prestamo,
        ...updatePrestamoDto,
        libro_id,
        usuario_id,
        fecha_del_prestamo,
      });

      const resultado = await this.prestamoRepository.save(prestamoActualizado);

      return {
        msg: 'Registro Actualizado',
        data: resultado,
        status: 200,
      };
    } catch (error) {
      console.error('Error actualizando préstamo:', error);
      throw new InternalServerErrorException('Póngase en contacto con el Sysadmin');
    }
  }

  async remove(libro_id: number, usuario_id: string, fecha_del_prestamo: string) {
    try {
      const result = await this.prestamoRepository.delete({
        libro_id, usuario_id, fecha_del_prestamo
      });

      if (result.affected === 0) {
        throw new NotFoundException(`Prestamo with libro_id ${libro_id}, socio_id ${usuario_id}, fecha_del_prestamo ${fecha_del_prestamo} not found`);
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

  async getlibro_ids() {
    const result = await this.prestamoRepository
    .createQueryBuilder("prestamo")
    .select("DISTINCT prestamo.libro_id", "libro_id")
    .orderBy("prestamo.libro_id", "ASC")
    .getRawMany();

    // Devuelve solo los valores (no objetos con `{ libro_id: number }`)
    return result.map((row) => row.libro_id).filter((e) => !!e);
  }
}


import { Injectable, InternalServerErrorException, Patch } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as fs from 'fs';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

type RawUser = {
  custom_id: string;
  email: string;
  password: string;
  username: string;
};
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async onModuleInit() {
    await this.loadUsersFromFile();
  }

  async loadUsersFromFile(): Promise<void> {
    try {
      const data = fs.readFileSync('src/modulos/seed/data/users.json', 'utf-8');
      const users: RawUser[] = JSON.parse(data);

      const legacyToUuid = new Map<string, string>();
      
      const userEntities = await Promise.all(
        users.map(async (user) => {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          const id = uuidv4(); // Generar UUID en lugar de usar valores numéricos

          // Guardar el mapeo entre custom_id y UUID real
          legacyToUuid.set(user.custom_id, id);

          return this.userRepository.create({
            id, 
            email: user.email,
            password: hashedPassword,
            username: user.username,
          });
        })
      );

      const existingUsers = await this.userRepository.count();
      if (existingUsers === 0) {
        await this.userRepository.save(userEntities);

        // Exportar el mapa a un archivo temporal JSON
        fs.writeFileSync('src/modulos/seed/data/user-id-map.json', JSON.stringify(Object.fromEntries(legacyToUuid), null, 2));

        console.log('Datos de usuarios volcados correctamente y mapa de IDs guardado.');
      } else {
        console.log('La tabla de usuarios ya contiene datos, no se volcaron nuevos.');
      }
    } catch (error) {
      console.error('Error al volcar los datos de usuarios:', error);
    }
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    const user = this.userRepository.find();
    return user;
    /*return `This action returns all user`;*/
  }

  findOne(id: string) {
    const user= this.userRepository.findOne({
      where:{
        id
      }
    });
    return user;
  }

  @Patch()
  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where:{
          id
        }
      });

      // Update the user entity with new values
      Object.assign(user, updateUserDto);

      await this.userRepository.save(user);
      return{
        msg: 'Registro Actualizado',
        data: user,
        status: 200
      }
    }catch(error){
      console.log(error);
      throw new InternalServerErrorException('Pongase en contacto con el Sysadmin')
    } 
  }

  async remove(id: string) {
    try {
      const result = await this.userRepository.delete(id);
      return{
        msg: 'Registro borrado',
        status: 200
      }
    }catch(error){
      console.log(error);
      throw new InternalServerErrorException('Pongase en contacto con el Sysadmin')
    }
  }

  async deleteAllUsers(){
    const query = this.userRepository.createQueryBuilder('user');
    try{
      return await query
        .delete()
        .where({})
        .execute()
    }catch(error){
      throw new InternalServerErrorException('sysadmin ...')
    }
  }

  async getUsernames() {
    const result = await this.userRepository
    .createQueryBuilder("user")
    .select("DISTINCT user.username", "username")
    .orderBy("user.username", "ASC")
    .getRawMany();

    // Devuelve solo los valores (no objetos con `{ username: string }`)
    return result.map((row) => row.username).filter((e) => !!e);
  }
}

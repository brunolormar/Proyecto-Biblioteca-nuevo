import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as fs from 'fs';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
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
      const users = JSON.parse(data);

      const userEntities = users.map((user) => {
        return this.userRepository.create({
          id: uuidv4(), // Generar UUID en lugar de usar valores numéricos
          email: user.email,
          password: user.password,
        });
      });

      const existingUsers = await this.userRepository.count();
      if (existingUsers === 0) {
        await this.userRepository.save(userEntities);
        console.log('Datos de usuarios volcados correctamente.');
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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

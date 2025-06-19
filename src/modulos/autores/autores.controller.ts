import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AutoresService } from './autores.service';
import { CreateAutoreDto } from './dto/create-autore.dto';
import { UpdateAutoreDto } from './dto/update-autore.dto';

@Controller('autores')
export class AutoresController {
  constructor(private readonly autoresService: AutoresService) {}

  @Get('buscar')
  buscarAutores(@Query('id') id: string) {
    console.log('Buscando autores con id parcial:', id);
    return this.autoresService.buscarPorIdParcial(id);
  }

  // @Get('buscar')
  // async buscarPorId(@Query('id') id: string) {
  //   const resultados = await this.autoresService.buscarPorIdParcial(id);
  //   return resultados.map((autor) => ({
  //     id: autor.codigo_de_autor,
  //     nombre: autor.nombre, // Asegúrate de que exista este campo en la entidad
  //   }));
  // }

  @Post()
  create(@Body() createAutoreDto: CreateAutoreDto) {
    console.log('usuario creado')
    return this.autoresService.create(createAutoreDto);
  }

  @Get()
  findAll() {
    return this.autoresService.findAll();
  }

  @Get('/nombres')
  getNombres() {
    return this.autoresService.getNombres();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.autoresService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAutoreDto: UpdateAutoreDto) {
    return this.autoresService.update(id, updateAutoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.autoresService.remove(id);
  }

}

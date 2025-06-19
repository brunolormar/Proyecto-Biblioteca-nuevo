import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LibrosService } from './libros.service';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';

@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  @Post()
  //@UseGuards(JwtAuthGuard)
  //@UseGuards(AuthGuard('jwt'))
  create(@Body() createLibroDto: CreateLibroDto) {
    console.log('libro creado')
    return this.librosService.create(createLibroDto);
  }

  @Get()
  findAll() {
    console.log('all')
    return this.librosService.findAll();
  }
  @Get('/categoria/:clasificacion')
  getclasificacion(@Param('clasificacion') clasificacion: string) {
    console.log('---', clasificacion)
    return this.librosService.getClasificacion(clasificacion);
  }
  
  @Get('/categoria')
  getclasificaciones() {
    console.log('---')
     return this.librosService.getClasificaciones();
  }

  @Get('/SituacionPres/:situacion')
  getSituacion(@Param('situacion') situacion: string) {
    console.log('---', situacion)
    return this.librosService.getSituacion(situacion);
  }
  
  @Get('/SituacionPres')
  getSituacionones() {
    console.log('---')
     return this.librosService.getSituaciones();
  }

  @Get('/Catalogo/:estado')
  getEstado(@Param('estado') estado: string) {
    console.log('---', estado)
    return this.librosService.getEstado(estado);
  }
  
  @Get('/Catalogo')
  getEstados() {
    console.log('---')
     return this.librosService.getEstados();
  }

  @Get('/Filtronombre/:Nombreautor')
  getNombreautor(@Param('Nombreautor') autor_id: string) {
    console.log('---', autor_id)
    return this.librosService.getNombreautor(autor_id);
  }

  @Get('/Filtronombre')
  getNombreautores() {
    console.log('---')
     return this.librosService.getNombreautores();
  }
  
  @Get('/editoriales')
  getEditoriales() {
    return this.librosService.getEditoriales();
  }

  @Get('/series')
  getSeries() {
    return this.librosService.getSeries();
  }

  @Get('/titulos')
  getTitulos() {
    return this.librosService.getTitulos();
  }
  
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.librosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateLibroDto: UpdateLibroDto) {
    return this.librosService.update(+id, updateLibroDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.librosService.remove(+id);
  }
}

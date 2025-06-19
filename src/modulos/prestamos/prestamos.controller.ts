import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';

@Controller('prestamos')
export class PrestamosController {
  constructor(private readonly prestamosService: PrestamosService) {}

  @Post()
  create(@Body() createPrestamoDto: CreatePrestamoDto) {
    console.log('prestamo creado')
    return this.prestamosService.create(createPrestamoDto);
  }

  @Get()
  findAll() {
    return this.prestamosService.findAll();
  }

  @Get('/libro_ids')
  getlibro_ids() {
    return this.prestamosService.getlibro_ids();
  }

  @Get(':libro_id/:usuario_id/:fecha_del_prestamo')
  findOne(
    @Param('libro_id') libro_id: number,
    @Param('usuario_') usuario_id: string,
    @Param('fecha_del_prestamo') fecha_del_prestamo: string
  ) {
    return this.prestamosService.findOne(libro_id, usuario_id, fecha_del_prestamo);
  }

  @Patch(':libro_id/:usuario_id/:fecha_del_prestamo')
  update(
    @Param('libro_id') libro_id: number,
    @Param('usuario_id') usuario_id: string,
    @Param('fecha_del_prestamo') fecha_del_prestamo: string, 
    @Body() updatePrestamoDto: UpdatePrestamoDto) {
    return this.prestamosService.update(libro_id, usuario_id, fecha_del_prestamo, updatePrestamoDto);
  }

  @Delete(':libro_id/:usuario_id/:fecha_del_prestamo')
  async remove(
    @Param('libro_id') libro_id: number,
    @Param('usuario_id') usuario_id: string,
    @Param('fecha_del_prestamo') fecha_del_prestamo: string,
  ) {
    return this.prestamosService.remove(libro_id, usuario_id, fecha_del_prestamo);
  }
}

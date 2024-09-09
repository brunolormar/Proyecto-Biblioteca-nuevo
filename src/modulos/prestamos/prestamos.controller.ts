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

  @Get(':libro_id/:socio_id/:fecha_del_prestamo')
  findOne(
    @Param('libro_id') libro_id: number,
    @Param('socio_') socio_id: number,
    @Param('fecha_del_prestamo') fecha_del_prestamo: string
  ) {
    return this.prestamosService.findOne(libro_id, socio_id, fecha_del_prestamo);
  }

  @Patch(':libro_id/:socio_id/:fecha_del_prestamo')
  update(
    @Param('libro_id') libro_id: number,
    @Param('socio_') socio_id: number,
    @Param('fecha_del_prestamo') fecha_del_prestamo: string, 
    @Body() updatePrestamoDto: UpdatePrestamoDto) {
    return this.prestamosService.update(libro_id, socio_id, fecha_del_prestamo, updatePrestamoDto);
  }

  @Delete(':libro_id/:socio_id/:fecha_del_prestamo')
  async remove(
    @Param('libro_id') libro_id: number,
    @Param('socio_id') socio_id: number,
    @Param('fecha_del_prestamo') fecha_del_prestamo: string,
  ) {
    return this.prestamosService.remove(libro_id, socio_id, fecha_del_prestamo);
  }
}

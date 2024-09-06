import { Libro } from "src/modulos/libros/entities/libro.entity";
import { Socio } from "src/modulos/socios/entities/socio.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";

@Entity({
    name:'PRESTAMOS'
})
export class Prestamo {

    @PrimaryColumn({ name: 'id_libro'})
    libro_id: number;

    @PrimaryColumn({ name: 'id_socio'})
    socio_id: number;

    @PrimaryColumn({ type: 'varchar', length: 20 })
    fecha_del_prestamo: string;

    @Column('text')
    fecha_limite_a_devolver: string;

    @Column('text')
    estado_del_prestamo: string;

    @ManyToOne(
        () => Libro,
        (libro) => libro.prestamosLibro,
        {cascade: true}
    )
    @JoinColumn({ name: 'id_libro' })
    libro: Libro

    @ManyToOne(
        () => Socio,
        (socio) => socio.prestamosSocio,
        {cascade: true}
    )
    @JoinColumn({ name: 'id_socio' })
    socio: Socio
}

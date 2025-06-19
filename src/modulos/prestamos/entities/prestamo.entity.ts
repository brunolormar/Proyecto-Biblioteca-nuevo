import { Libro } from "src/modulos/libros/entities/libro.entity";
import { User } from "src/modulos/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";

@Entity({
    name:'PRESTAMOS'
})
export class Prestamo {

    @PrimaryColumn({ name: 'id_libro'})
    libro_id: number;

    @PrimaryColumn({ name: 'id_usuario'})
    usuario_id: string;

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
        () => User,
        (user) => user.prestamosUser,
        {cascade: true}
    )
    @JoinColumn({ name: 'id_usuario' })
    usuario: User
}

import { Libro } from "src/modulos/libros/entities/libro.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";

@Entity({
    name:'AUTORES'
})
export class Autore {

    @PrimaryColumn({ type: 'varchar', unique: true, length: 20})
    codigo_de_autor: string;

    @Column('text')
    nombre: string;

    @OneToMany(
        () => Libro,
        (libro) => libro.autor,
        { eager: true }
    )
    libros?: Libro[]
}

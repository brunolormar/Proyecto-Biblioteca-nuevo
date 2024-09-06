import { Autore } from "src/modulos/autores/entities/autore.entity";
import { Prestamo } from "src/modulos/prestamos/entities/prestamo.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity({
    name:'LIBROS'
})
export class Libro {

    @PrimaryColumn('numeric', { unique: true})
    id: number;

    @Column({ name: 'id_autor'})
    autor_id: string;

    @Column('text')
    titulo: string;

    @Column('text')
    isbn: string;

    @Column('text')
    fecha_de_publicacion: string;

    @Column('text')
    editorial: string;

    @Column('numeric')
    numero_de_paginas: number;

    @Column('text', { nullable: true})
    serie: string;

    @Column('text')
    clasificacion: string;

    @Column('text')
    estado: string;

    @Column('text')
    situacion: string;

    @Column('varchar', {
        nullable: true,
        unique: false,
    })
    portada: string;

    @ManyToOne(
        () => Autore,
        (autor) => autor.libros,
        {cascade: true}
    )
    @JoinColumn({ name: 'id_autor' })
    autor: Autore

    @OneToMany(
        () => Prestamo,
        (prestamo) => prestamo.libro,
        { eager: true }
    )
    prestamosLibro: Prestamo
}

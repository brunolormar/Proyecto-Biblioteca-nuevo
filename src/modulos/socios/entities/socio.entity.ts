import { Prestamo } from "src/modulos/prestamos/entities/prestamo.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity({
    name:'SOCIOS'
})
export class Socio {

    @PrimaryColumn('numeric', { unique: true})
    numero_de_socio: number;

    @Column('text')
    nombre: string;

    @Column('text')
    apellidos: string;

    @Column('text', { unique: false, nullable: true})
    direccion: string;

    @Column('text', { unique: true})
    DNI: string;

    @Column('numeric', { nullable: true})
    numero_de_telefono: number;

    @OneToMany(
        () => Prestamo,
        (prestamo) => prestamo.socio,
        { eager: true }
    )
    prestamosSocio: Prestamo
}


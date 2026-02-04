import { Sale } from "../../sale/entities/sale.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Buyer {

    @PrimaryGeneratedColumn() //TODO: documento
    id: number

    @Column('text')
    fullName: string;

    // @ManyToMany(
    //     () => Product,
    //     (product) => product.buyer
    // )
    // product: Product

    @Column('int', {
        nullable: true
    })
    dni: number

    @OneToMany(
        () => Sale,
        (sale) => sale.buyer,
        { eager: true }
    )
    sale: Sale[]

}
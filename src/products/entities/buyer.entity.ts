import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Sell } from "./sell.entity";

@Entity()
export class Buyer {

    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    name: string;

    // @ManyToMany(
    //     () => Product,
    //     (product) => product.buyer
    // )
    // product: Product

    @OneToMany(
        () => Sell,
        (sell) => sell.buyer
    )
    sell: Sell[]

}
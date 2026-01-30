import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { Buyer } from "./buyer.entity";

@Entity()
export class Sell {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(
        () => Product,
        (product) => product.sell,
    )
    @JoinColumn()
    product: Product

    @Column('date')
    date: string

    @Column('float')
    price: number

    @ManyToOne(
        () => Buyer,
        (buyer) => buyer.sell,
    )
    buyer: Buyer
}
import { Buyer, Product } from "../../products/entities";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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
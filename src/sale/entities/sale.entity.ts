import { Buyer } from "../../buyer/entities/buyer.entity";
import { Product } from "../../products/entities";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Sale {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(
        () => Product,
        (product) => product.sale,
    )
    @JoinColumn()
    product: Product

    @Column('date')
    date: Date

    @Column('float')
    price: number

    @ManyToOne(
        () => Buyer,
        (buyer) => buyer.sale,
    )
    buyer: Buyer
}
import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { State } from "../interfaces/state-values";
import { ProductImage } from "./productImage.entity";
import { Sell } from "./sell.entity";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    title: string;

    @Column('text', {
        nullable: true,
    })
    description: string;

    @Column('float')
    price: number;

    @Column('enum', {
        enum: State,
        default: State.NEW,
    })
    state: State;

    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images: ProductImage[];

    // @ManyToMany(
    //     () => Buyer,
    //     (buyer) => buyer.product
    // )
    // @JoinTable({
    //     name: 'sell',
    //     joinColumn: {
    //         name: 'product_id',
    //     },
    //     inverseJoinColumn: {
    //         name: 'buyer_id',
    //     },
    // })
    // buyer 

    @OneToOne(
        () => Sell,
        (sell) => sell.product,
        {nullable: true}
    )
    sell: Sell

}

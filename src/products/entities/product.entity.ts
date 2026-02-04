import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { State } from "../interfaces/state-values";
import { ProductImage } from "./productImage.entity";
import { Sale } from "../../sale/entities/sale.entity";

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

    @Column('text')
    slug: string

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
    
    @OneToOne(
        () => Sale,
        (sale) => sale.product,
        { nullable: true }
    )
    sale: Sale

    @BeforeInsert()
    handleSlug() {
        if (!this.slug) {
            this.slug = this.title
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(" ", "_")
            .replaceAll("'", "")
    }
}

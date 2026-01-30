import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Product, ProductImage } from './entities';
import { isUUID } from 'class-validator';
// import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepostory: Repository<ProductImage>,

  ) { }

  async create(createProductDto: CreateProductDto) {
    const { images = [], ...productDetails } = createProductDto;

    const product = this.productRepository.create({
      ...productDetails,
      images: images.map((image) => this.productImageRepostory.create({ url: image })),
    })

    try {

      await this.productRepository.save(product)

      return { ...product, images }
    } catch (error) {
      console.log(error)
    }

  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    })

    return products;
  }

  async findOne(term: string) {
    let product: Product | null

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term })
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod') //alias
      product = await queryBuilder.where('UPPER(title) =:title or slug =:slug', {
        title: term.toUpperCase(),
        slug: term.toLowerCase(),
      })
        .leftJoinAndSelect('prod.images', 'images')
        .getOne()
    }

    if (!product) throw new NotFoundException(`Product with id, title or slug "${term}" does not exist`)

    return product
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id)

    await this.productRepository.remove(product)
  }
}

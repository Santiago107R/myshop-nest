import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Product, ProductImage } from './entities';
import { isUUID } from 'class-validator';
// import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger()
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepostory: Repository<ProductImage>,

    private readonly dataSource: DataSource
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
      this.handleError(error)
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

    if (!product) throw new NotFoundException(`Product with id, title or slug "${term}" not found`)

    return product
  }

  async findOnePlain(id: string) {
    const {images = [], ...rest} = await this.findOne(id)

    return {
      ...rest,
      images: images.map((image) => image.url),
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const {images, ...toUpdate} = updateProductDto

    const product = await this.productRepository.preload({
      id,
      ...toUpdate
    })

    if (!product) throw new NotFoundException(`Product with id "${id}" not found`)

    // crear transaction 
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, {product: {id}})
        
        product.images = images.map((image) => this.productImageRepostory.create({url: image}))
      }

      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();

      await queryRunner.release();

      return this.findOne(id)
    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleError(error);
    }

  }

  async remove(id: string) {
    const product = await this.findOne(id)

    await this.productRepository.remove(product)
  }

  private handleError(error: any) {
    if (error.code === "23505")
      throw new BadRequestException(error.detail)


    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}

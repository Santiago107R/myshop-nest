import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { Repository } from 'typeorm';
import { Product } from '../products/entities';
// import { Buyer } from '../buyer/entities/buyer.entity';
import { ProductsService } from '../products/products.service';
import { State } from 'src/products/interfaces/state-values';
import { BuyerService } from '../buyer/buyer.service';

@Injectable()
export class SaleService {
  private logger = new Logger
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    // @InjectRepository(Buyer)
    // private readonly buyerRepository: Repository<Buyer>,

    private readonly productsService: ProductsService,

    private readonly buyerService: BuyerService
  ) { }

  async create(createSaleDto: CreateSaleDto) {
    const { productId, buyerId, ...rest } = createSaleDto

    const product = await this.productsService.findOne(productId)
    const buyer = await this.buyerService.findOne(buyerId)

    if (product.state === 'sold') throw new BadRequestException('El producto ya fue vendido');

    const sale = this.saleRepository.create({
      ...rest,
      product,
      buyer
    })

    product.state = State.SOLD;

    try {
      const savedSale = await this.saleRepository.save(sale);

      await this.productRepository.save(product);

      return {
        message: 'Venta exitosa',
        sell: savedSale
      };

    } catch (error) {
      product.state = State.NEW;
      await this.productRepository.save(product);

      console.error(error);
      throw new InternalServerErrorException('Error al guardar la venta: ' + error.message);
    }
  }

  async findAll() {
    const sale = await this.saleRepository.find({
      relations: {
        product: true,
        buyer: true,
      }
    })

    return sale;
  }

  async findOne(id: number) {
    const queryBuilder = this.saleRepository.createQueryBuilder('sale')
    const sale = await queryBuilder.where('sale.id =:id', {
      id: id
    })
      .leftJoinAndSelect('sale.product', 'product')
      .leftJoinAndSelect('sale.buyer', 'buyer')
      .getOne()

    if (!sale) throw new NotFoundException(`Sale with id '${id}' does not found`)

    return sale
  }

  async update(id: number, updateSaleDto: UpdateSaleDto) {
    const sale = await this.saleRepository.preload({
      id,
      ...updateSaleDto
    })

    if (!sale) throw new NotFoundException(`Sale with id "${id}" does not found`)

    try {

      return await this.saleRepository.save(sale)
    } catch (error) {
      this.handleError(error)
    }
  }

  async remove(id: number) {
    const sale = await this.findOne(id)

    try {

      await this.saleRepository.remove(sale)

      return "Delete succefully"
    } catch (error) {
      this.handleError(error)
    }
  }

  private handleError(error: any) {
    if (error.code === "23505")
      throw new BadRequestException(error.detail)


    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}

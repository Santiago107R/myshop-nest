import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Buyer } from './entities/buyer.entity';
import type { Repository } from 'typeorm';


@Injectable()
export class BuyerService {
  private logger = new Logger
  constructor(
    @InjectRepository(Buyer)
    private readonly buyerRepository: Repository<Buyer>
  ) { }

  async create(createBuyerDto: CreateBuyerDto) {
    const buyer = this.buyerRepository.create(createBuyerDto)

    return await this.buyerRepository.save(buyer);
  }

  async findAll() {
    const buyer = await this.buyerRepository.find({
      relations: {
        sale: true
      }
    })

    return buyer;
  }

  async findOne(id: number) {
    const buyer = await this.buyerRepository.findOneBy({ id })

    if (!buyer) throw new NotFoundException(`Buyer with id "${id}" does not found`)

    return buyer
  }

  async update(id: number, updateBuyerDto: UpdateBuyerDto) {

    const buyer = await this.buyerRepository.preload({
      id,
      ...updateBuyerDto
    })

    if (!buyer) throw new NotFoundException(`Buyer with id "${id}" does not found`)

    try {

      await this.buyerRepository.save(buyer)

      return this.findOne(id)

    } catch (error) {
      this.handleError(error)
    }
  }

  async remove(id: number) {
    const buyer = await this.findOne(id)
    try {

      this.buyerRepository.remove(buyer)
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

import { Injectable } from '@nestjs/common';
import { CreateSellDto } from './dto/create-sell.dto';
import { UpdateSellDto } from './dto/update-sell.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sell } from './entities/sell.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SellService {

  constructor(
    @InjectRepository(Sell)
    private readonly sellRepository: Repository<Sell>
  ) {}

  create(createSellDto: CreateSellDto) {
    return 'This action adds a new sell';
  }

  async findAll() {
    const sell = await this.sellRepository.find({
      relations: {
        product: true,
        buyer: true,
      }
    })

    return sell;
  }

  findOne(id: number) {
    return `This action returns a #${id} sell`;
  }

  update(id: number, updateSellDto: UpdateSellDto) {
    return `This action updates a #${id} sell`;
  }

  remove(id: number) {
    return `This action removes a #${id} sell`;
  }
}

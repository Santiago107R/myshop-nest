import { Module } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { BuyerController } from './buyer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Buyer } from './entities/buyer.entity';

@Module({
  controllers: [BuyerController],
  providers: [BuyerService],
  imports: [
    TypeOrmModule.forFeature([Buyer])

  ],
  exports: [TypeOrmModule, BuyerService]
})
export class BuyerModule { }

import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { ProductsModule } from 'src/products/products.module';
import { BuyerModule } from 'src/buyer/buyer.module';

@Module({
  controllers: [SaleController],
  providers: [SaleService],
  imports: [
    TypeOrmModule.forFeature([Sale]),

    ProductsModule,
    BuyerModule,
  ]
})
export class SaleModule { }

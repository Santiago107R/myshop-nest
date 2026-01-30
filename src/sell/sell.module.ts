import { Module } from '@nestjs/common';
import { SellService } from './sell.service';
import { SellController } from './sell.controller';
import { Sell } from './entities/sell.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [SellController],
  providers: [SellService],
  imports: [
      TypeOrmModule.forFeature([Sell])
    
  ]
})
export class SellModule {}

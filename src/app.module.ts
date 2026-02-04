import { Inject, Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { SaleModule } from './sale/sale.module';
import { BuyerModule } from './buyer/buyer.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [

    ConfigModule.forRoot(),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        // ssl: configService.get('STAGE') === 'prod',
        ssl: false,
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +(configService.get('DB_PORT') ?? 5432),
        database: configService.get('DB_NAME'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),

    ProductsModule,

    CommonModule,

    SaleModule,

    BuyerModule,

    FilesModule,

    AuthModule,
  ],
})
export class AppModule { }

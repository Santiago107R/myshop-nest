import { PartialType } from '@nestjs/mapped-types';
import { CreateSaleDto } from './create-sale.dto';
import { IsDate, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateSaleDto extends PartialType(CreateSaleDto) { 
    @IsOptional()
    @IsString()
    @MinLength(1)
    date?: Date
}

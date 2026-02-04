import { IsPositive, IsString, Min } from "class-validator";

export class CreateSaleDto {
    @IsPositive()
    @Min(1)
    price: number;

    @IsString()
    productId: string;

    @IsPositive()
    @Min(1)
    buyerId: number;
}

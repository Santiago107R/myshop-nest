import { IsPositive, IsString, Min } from "class-validator";

export class CreateSellDto {
    @IsPositive()
    @Min(1)
    price: number;

    @IsString()
    productId: string;

    @IsPositive()
    @Min(8)
    buyerId: number;
}

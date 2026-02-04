import { IsOptional, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreateBuyerDto {
    @IsString()
    @MinLength(1)
    fullName: string;

    @IsPositive()
    @IsOptional()
    @Min(8)
    dni?: number
}

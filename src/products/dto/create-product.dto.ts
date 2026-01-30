import { IsArray, IsIn, IsOptional, IsPositive, IsString, Min, MinLength } from "class-validator";
import { State } from "../interfaces/state-values";

export class CreateProductDto {
    @IsString()
    @MinLength(1)
    title: string;

    @IsOptional()
    @IsString()
    @MinLength(1)
    description?: string;

    @IsPositive()
    @Min(1)
    price: number;

    @IsOptional()
    @IsString()
    slug?: string

    @IsIn(["new", "sold"])
    state: State;

    @IsString(({ each: true }))
    @IsArray()
    @IsOptional()
    images?: string[]

}

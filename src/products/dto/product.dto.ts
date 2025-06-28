import { IsString, IsNumber, IsOptional } from 'class-validator'

export class ProductDto {
  @IsString()
  name: string

  @IsNumber()
  price: number

  @IsNumber()
  stock: number

  @IsString()
  category: string

  @IsString()
  description: string

  @IsOptional()
  @IsString()
  existingMainImg: string

  @IsOptional()
  @IsString()
  existingImages: string[]
  
}

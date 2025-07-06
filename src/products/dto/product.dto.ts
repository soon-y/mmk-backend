import { IsString, IsNumber, IsOptional } from 'class-validator'

export class ProductDto {
  @IsString()
  name: string

  @IsString()
  category: string

  @IsNumber()
  price: number

  @IsString()
  size: string

  @IsString()
  color: string

  @IsString()
  colorHex: string

  @IsString()
  stock: string

  @IsString()
  description: string

  @IsString()
  material: string

  @IsString()
  measurement: string

  @IsString()
  imagesCount: string

  @IsOptional()
  @IsString()
  existingImages: string[]

  @IsOptional()
  @IsString()
  originalOrderCount: string

  @IsOptional()
  @IsString()
  newOrderCount: string
}

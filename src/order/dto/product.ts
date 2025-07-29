import { IsNumber, IsString } from 'class-validator'

export class ProductDto {
  @IsNumber()
  productId: number

  @IsString()
  size: number

  @IsString()
  color: number

  @IsNumber()
  quantity: number

  @IsNumber()
  total: number

}

import { IsNumber } from 'class-validator'

export class CartDto {
  @IsNumber()
  id: number

  @IsNumber()
  size: number
  
  @IsNumber()
  color: number

  @IsNumber()
  qnt: number
}

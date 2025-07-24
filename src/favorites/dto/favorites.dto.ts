import { IsNumber } from 'class-validator'

export class FavoritesDto {
  @IsNumber()
  id: number

  @IsNumber()
  size: number
  
  @IsNumber()
  color: number
}

import { IsString, IsNumber, IsOptional } from 'class-validator'

export class BannerDto {
  @IsNumber()
  id: number

  @IsString()
  title: string

  @IsOptional()
  @IsString()
  text: string

  @IsOptional()
  @IsString()
  buttonName: string

  @IsOptional()
  @IsString()
  buttonLink: string

  @IsNumber()
  order: number

  @IsOptional()
  @IsString()
  image: string
}

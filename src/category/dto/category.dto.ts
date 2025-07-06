import { IsString, IsNumber, IsOptional, IsBoolean, ValidateIf } from 'class-validator'

export class CategoryDto {
  @IsNumber()
  id: number

  @IsString()
  name: string

  @IsNumber()
  order: number

  @IsBoolean()
  optGroup: boolean

  @IsOptional()
  @IsString()
  image: string

  @ValidateIf((obj) => obj.groupID !== null)
  @IsNumber()
  @IsOptional()
  groupID: number | null
}

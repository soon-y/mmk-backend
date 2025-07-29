import { IsNumber, IsString } from 'class-validator'

export class OrderDto {
  @IsString()
  userId: string

  @IsString()
  status: string

  @IsNumber()
  totalAmount: number

  @IsString()
  paymentMethod: string

  @IsString()
  paymentStatus: string

  @IsNumber()
  shippingFee: number

  @IsString()
  transactionId: string

  @IsNumber()
  shippingAddrId: number

  @IsNumber()
  billingAddrId: number
}

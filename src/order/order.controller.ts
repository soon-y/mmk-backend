import {
  Controller,
  Post, Get,
  Body, Query
} from '@nestjs/common'
import { OrderService } from './order.service'
import { OrderDto } from './dto/order'
import { ProductDto } from './dto/product'

@Controller('Orders')
export class OrderController {
  constructor(private readonly OrderService: OrderService) { }

  @Get()
  async getOrder(@Query('user') user: string) {
    return this.OrderService.getOrders(user)
  }

  @Get('all')
  async getAll(@Query('user') user: string) {
    return this.OrderService.getAllOrders(user)
  }

  @Get('customer')
  async getAllCustomer() {
    return this.OrderService.getAllCustomerOrders()
  }

  @Get('this')
  async getThis(
  @Query('user') user: string,
  @Query('orderId') orderId: string){
    return this.OrderService.getThisOrder(user, orderId)
  }

  @Get('product')
  async getAllProduct(@Query('user') user: string) {
    return this.OrderService.getAllOrderedProducts(user)
  }

  @Post('add')
  async addOrder(
    @Body() body: { orderInfo: OrderDto, productInfo: ProductDto[] },
  ) {
    return this.OrderService.addOrder(body.orderInfo, body.productInfo)
  }

  @Post('update')
  async updateOrderStatus(
    @Body() body: { userId: string, orderId: string, status: string },
  ) {
    return this.OrderService.updateOrderStatus(body.userId, body.orderId, body.status)
  }
}

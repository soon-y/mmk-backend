import {
  Controller,
  Post, Get,
  Body, Query
} from '@nestjs/common'
import { CartService } from './cart.service'
import { CartDto } from './dto/cart'

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Get()
  async getAll(@Query('user') user: string) {
    return this.cartService.getCart(user)
  }

  @Post('drop')
  async dropCart(
    @Body() body: { user: string },
  ) {
    return this.cartService.dropCart(body.user)
  }

  @Post('add')
  async addCart(
    @Body() body: { user: string, product: CartDto },
  ) {
    return this.cartService.addCart(body.user, body.product)
  }

  @Post('delete')
  async deleteCart(
    @Body() body: { user: string, product: CartDto },
  ) {
    return this.cartService.deleteCart(body.user, body.product)
  }

  @Post('update')
  async updateCartQnt(
    @Body() body: { user: string, index: number, qnt: number },
  ) {
    return this.cartService.updateCartQnt(body.user, body.index, body.qnt)
  }

  @Get('getQnt')
  async getQnt(
    @Query('user') user: string,
    @Query() query: { id: number; size: number; color: number }
  ) {
    return this.cartService.getCartQnt(user, query);
  }
}

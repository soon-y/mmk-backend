import {
  Controller,
  Post, Get,
  Body, Query
} from '@nestjs/common'
import { FavoritesService } from './favorites.service'
import { FavoritesDto } from './dto/favorites.dto'

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @Get()
  async getAll(@Query('user') user: string) {
    return this.favoritesService.getFavorites(user)
  }

  @Post('drop')
  async dropFavorites(
    @Body() body: { user: string },
  ) {
    return this.favoritesService.dropFavorites(body.user)
  }

  @Post('add')
  async addFavorites(
    @Body() body: { user: string, product: FavoritesDto },
  ) {
    return this.favoritesService.addFavorites(body.user, body.product)
  }

  @Post('delete')
  async deleteFavorites(
    @Body() body: { user: string, product: FavoritesDto },
  ) {
    return this.favoritesService.deleteFavorites(body.user, body.product)
  }
}

import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ProductsModule } from './products/products.module'
import { CategoryModule } from './category/category.module'
import { AuthModule } from './auth/auth.module'
import { BannerModule } from './banner/banner.module'
import { FavoritesModule } from './favorites/favorites.module'
import { CartModule } from './cart/cart.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductsModule,
    CategoryModule,
    AuthModule,
    BannerModule,
    FavoritesModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

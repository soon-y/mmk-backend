import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ProductsModule } from './products/products.module'
import { CategoryModule } from './category/category.module'
import { AuthModule } from './auth/auth.module'
import { BannerModule } from './banner/banner.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductsModule,
    CategoryModule,
    AuthModule,
    BannerModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

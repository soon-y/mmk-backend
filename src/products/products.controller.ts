import {
  Controller,
  Post, Get, Patch,
  UploadedFiles,
  UseInterceptors,
  Body, Param,
  NotFoundException
} from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { ProductsService } from './products.service'
import { ProductDto } from './dto/product.dto'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'files', maxCount: 10 },
      { name: 'mainImg', maxCount: 1 },
    ]),
  )
  async createProduct(
    @UploadedFiles() files: { files?: Express.Multer.File[], mainImg?: Express.Multer.File[] },
    @Body() body: ProductDto,
  ) {
    const productFiles = files.files || []
    const mainImageFile = files.mainImg ? files.mainImg[0] : null
    return this.productsService.createProductWithImages(body, productFiles, mainImageFile)
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'files', maxCount: 10 },
      { name: 'mainImg', maxCount: 1 },
    ]),
  )
  async updateProduct(
    @Param('id') id: string,
    @UploadedFiles() files: { files?: Express.Multer.File[], mainImg?: Express.Multer.File[] },
    @Body() body: ProductDto,
  ) {
    const productFiles = files.files || []
    const mainImageFile = files.mainImg ? files.mainImg[0] : null
    return this.productsService.updateProduct(Number(id), body, productFiles, mainImageFile)
  }

  @Get()
  async getAll() {
    return this.productsService.getAllProducts()
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    const product = await this.productsService.getProductById(id)
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`)
    }
    return product
  }
}

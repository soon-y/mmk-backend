import {
  Controller,
  Post, Get, Patch, Delete,
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
      { name: 'files', maxCount: 50 },
    ]),
  )
  async createProduct(
    @UploadedFiles() files: { files?: Express.Multer.File[] },
    @Body() body: ProductDto,
  ) {
    const productFiles = files.files || []
    return this.productsService.createProductWithImages(body, productFiles)
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'files', maxCount: 50 },
    ]),
  )
  async updateProduct(
    @Param('id') id: string,
    @UploadedFiles() files: { files?: Express.Multer.File[] },
    @Body() body: ProductDto,
  ) {
    const productFiles = files.files || []
    return this.productsService.updateProduct(Number(id), body, productFiles)
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

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(Number(id))
  }

}

import {
  Controller,
  Post, Get,
  Body,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { AnyFilesInterceptor } from '@nestjs/platform-express'
import { CategoryService } from './category.service'
import { CategoryDto } from './dto/category.dto'

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post('replace')
  @UseInterceptors(AnyFilesInterceptor())
  async replaceCategories(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { categories: string },
  ) {
    const categories: CategoryDto[] = JSON.parse(body.categories)
    return this.categoryService.replaceAll(categories, files)
  }

  @Get()
  async getAll() {
    return this.categoryService.getCategory()
  }
}

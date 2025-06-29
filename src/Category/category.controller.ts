import {
  Controller,
  Post, Get,
  Body,
} from '@nestjs/common'
import { CategoryService } from './category.service'
import { CategoryDto } from './dto/category.dto'

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post('replace')
  async replaceCategories(@Body() categories: CategoryDto[]) {
    return this.categoryService.replaceAll(categories)
  }

  @Get()
  async getAll() {
    return this.categoryService.getCategory()
  }
}

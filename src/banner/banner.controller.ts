import {
  Controller,
  Post, Get,
  Body,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { AnyFilesInterceptor } from '@nestjs/platform-express'
import { BannerService } from './banner.service'
import { BannerDto } from './dto/banner.dto'

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) { }

  @Post('replace')
  @UseInterceptors(AnyFilesInterceptor())
  async replaceBanners(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { banners: string },
  ) {
    const banners: BannerDto[] = JSON.parse(body.banners)
    return this.bannerService.replaceAll(banners, files)
  }

  @Get()
  async getAll() {
    return this.bannerService.getBanners()
  }
}

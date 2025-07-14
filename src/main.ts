import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: ['https://mmk-admin.vercel.app', 'https://mmk-shop.vercel.app', 'http://localhost:5173'], 
    credentials: true,
  })
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()

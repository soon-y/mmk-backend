import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  async login(@Body() body: { email: string, password: string }) {
    return this.authService.login(body.email, body.password)
  }

  @Post('register')
  async register(
    @Body() body: { name: string, email: string, password: string },
  ) {
    return this.authService.register(body.name, body.email, body.password)
  }

  @Post('findCustomerByEmail')
  async findCustomerByEmail(@Body() body: { email: string }) {
    return this.authService.findCustomerByEmail(body.email)
  }

  @Post('registerCustomer')
  async registerCustomer(@Body() body: { email: string, password: string, firstName: string, lastName: string }) {
    return this.authService.registerCustomer(body.email, body.password, body.firstName, body.lastName)
  }

  @Post('loginCustomer')
  async loginCustomer(@Body() body: { email: string, password: string }) {
    return this.authService.loginCustomer(body.email, body.password)
  }
}

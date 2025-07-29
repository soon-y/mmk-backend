import { Query, Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UsersService } from './users.service'

interface AuthenticatedRequest extends Request {
  user: {
    email: string
    avatar_url: string
    name: string
    created_at: Date
  }
}

interface CustomerAuthenticatedRequest extends Request {
  user: {
    id: string
    password: string
    email: string
    firstName: string
    lastName: string
    created_at: Date
    contact: number
  }
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req: AuthenticatedRequest) {
    return req.user
  }

  @Get('customer')
  @UseGuards(AuthGuard('jwt-customer'))
  getCustomerProfile(@Request() req: CustomerAuthenticatedRequest) {
    const { password, ...safeUser } = req.user
    return safeUser
  }

  @Get()
  async getAll() {
    return this.usersService.getAllMembers()
  }

  @Get('address')
  async getAddr(@Query('id') user: string) {
    return this.usersService.getAddr(user)
  }

  @Get('billing')
  async getBiilingAddr(@Query('id') user: string) {
    return this.usersService.getBiilingAddr(user)
  }

  @Post('updateInfo')
  async updateCustomerInfo(
    @Body('id') id: string,
    @Body('info') info: Record<string, any>
  ) {
    return this.usersService.updateCustomerInfo(id, info)
  }

  @Post('updateAddr')
  async updateCustomerAddr(
    @Body('id') id: string,
    @Body('index') index: number,
    @Body('info') info: Record<string, any>
  ) {
    return this.usersService.updateCustomerAddr(id, index, info)
  }

  @Post('updateBillingAddr')
  async updateCustomerBillingAddr(
    @Body('id') id: string,
    @Body('index') index: number,
    @Body('info') info: Record<string, any>
  ) {
    return this.usersService.updateCustomerBillingAddr(id, index, info)
  }

  @Post('addAddr')
  async addCustomerAddr(
    @Body('info') info: Record<string, any>
  ) {
    return this.usersService.addCustomerAddr(info)
  }

  @Post('addBillingAddr')
  async addCustomerBillingAddr(
    @Body('info') info: Record<string, any>
  ) {
    return this.usersService.addCustomerBillingAddr(info)
  }

  @Post('deleteAddr')
  async deleteAddr(
    @Body('id') id: string,
    @Body('index') index: number,
    @Body('target') target: string
  ) {
    return this.usersService.deleteCustomerAddr(id, index, target)
  }

  @Post('updateAddrSelection')
  async updateAddrSelection(
    @Body('id') id: string,
    @Body('index') index: number,
    @Body('target') target: string
  ) {
    return this.usersService.updateAddrSelection(id, index, target)
  }
}

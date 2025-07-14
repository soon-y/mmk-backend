import { Controller, Get, UseGuards, Request } from '@nestjs/common'
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
    email: string
    firstName: string
    lastName: string
    created_at: Date
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
    return req.user
  }

  @Get()
  async getAll() {
    return this.usersService.getAllMembers()
  }
}

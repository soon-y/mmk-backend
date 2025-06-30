import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(email: string, password: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findUserByEmail(email)
    if (!user) throw new UnauthorizedException('User not found')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new UnauthorizedException('Invalid credentials')

    const payload = { sub: user.id, email: user.email }
    const token = this.jwtService.sign(payload)

    return { access_token: token }
  }

  async register(name: string, email: string, password: string) {
    const user = await this.usersService.findByEmail(email)
    if (user) {
      throw new UnauthorizedException('Email already registered')
    }
    return this.usersService.createUser(name, email, password)
  }
}

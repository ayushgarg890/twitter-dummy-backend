import { Body, Controller, NotFoundException, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './authorization.service';
import { request } from 'https';
import { JwtPayload } from './dto/jwt-token.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() request: JwtPayload) {
    const user = await this.authService.validateUser(request);

    if(!user){
        throw new NotFoundException("No");
    }

    return {token: await this.authService.generateToken(user)};

  }
}
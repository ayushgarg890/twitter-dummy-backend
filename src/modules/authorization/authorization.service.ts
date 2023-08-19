import { Injectable, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtPayload } from './dto/jwt-token.interface';
import { User } from '../user/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(payload: JwtPayload): Promise<User> {
    const { email, password } = payload;
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    if(user.password !== password){
      throw new MethodNotAllowedException('Password is Incorrect');
    }
    return user;
  }

  async ValidateToken(payload: string):Promise<User>{
    const user = await this.usersService.findUserByEmail(payload);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }


  async generateToken(user: User): Promise<string> {
    const payload = { email: btoa(btoa(user.email))};
    return this.jwtService.sign(payload);
  }
}

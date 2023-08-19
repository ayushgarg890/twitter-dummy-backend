import { Controller, Post, Get, HttpException, InternalServerErrorException, Body, UsePipes, Res, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/createUser")
  async createUser(@Body() createUserDto : CreateUserDto): Promise<any> {
     const user = await this.userService.createUser(createUserDto.username,createUserDto.email,createUserDto.password);
      return { message: 'User registered successfully', user };
  }

  @Get("/getAllUser")
  async getAllUsers(@Res() response): Promise<User[]> {
    try {
      const users = await this.userService.findAllUsers();
      return response.status(HttpStatus.OK).json(users);
    } catch (error) {
      console.error(error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred' });
    }
  }

  
}

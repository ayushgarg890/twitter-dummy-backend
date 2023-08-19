import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async createUser(username: string, email: string, password: string): Promise<User> {
    const newUser = new this.userModel({ username, email, password });

    try {
     const savedUser = await newUser.save();
    return savedUser.toObject(); 
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Username or email already exists');
      }
      throw error;
    }
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // async findUserById(id: string): Promise<User | null> {
  //   return this.userModel.findById(id).lean().exec();
  // }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).lean().exec();
  }
}

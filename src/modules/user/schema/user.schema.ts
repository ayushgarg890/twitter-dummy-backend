import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User{

  @Prop({ unique: true, index:true })
  username: string;

  @Prop({ unique: true, index:true })
  email: string;

  @Prop()
  password: string; // In a real application, you should hash the password
  // Other properties
}

export const UserSchema = SchemaFactory.createForClass(User);


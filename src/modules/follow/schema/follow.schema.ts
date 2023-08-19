import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

@Schema()
export class Follow {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' }) // Reference to the User model
  follower: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' }) // Reference to the User model
  following: string;

  @Prop({ default: Date.now }) // Add createdAt field with default value
  createdAt: Date;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);

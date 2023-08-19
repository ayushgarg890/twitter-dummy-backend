// src/tweet/tweet.entity.ts for MongoDB
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from 'src/modules/user/schema/user.schema';

@Schema()
export class Tweet extends Document {

  @Prop()
  content: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  userId: string; // Store the user's ID as a reference

}

export const TweetSchema = SchemaFactory.createForClass(Tweet);

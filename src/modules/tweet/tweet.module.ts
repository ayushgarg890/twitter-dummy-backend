import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';
import { Tweet, TweetSchema } from './schema/tweet.schema';
import { FollowModule } from '../follow/follow.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tweet.name, schema: TweetSchema }]),
    FollowModule  
  ],
  controllers: [TweetController],
  providers: [TweetService],
})
export class TweetModule {}

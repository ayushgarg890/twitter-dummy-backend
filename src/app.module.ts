import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/authorization/authorization.module';
import { TweetModule } from './modules/tweet/tweet.module';
import { APP_PIPE } from '@nestjs/core';
import * as cors from 'cors';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { FollowModule } from './modules/follow/follow.module';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL),
    UserModule,
    AuthModule,
    TweetModule,
    FollowModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // cors middleware to all routes
    consumer.apply(cors()).forRoutes('*');
  }
}

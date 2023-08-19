import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { Follow, FollowSchema } from './schema/follow.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Follow', schema: FollowSchema }])],
  controllers: [FollowController],
  providers: [FollowService],
  exports: [FollowService]
})
export class FollowModule {}

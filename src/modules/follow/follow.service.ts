import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Follow } from './schema/follow.schema';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel('Follow')
    private readonly followModel: Model<Follow>,
  ) {}

  async followUser(followerId: string, followingId: string): Promise<Follow> {
    const follow = new this.followModel({ follower: followerId, following: followingId });
    return follow.save();
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    await this.followModel.deleteOne({ follower: followerId, following: followingId });
  }

  async getFollowingUsers(userId: string): Promise<string[]> {
    const follows = await this.followModel.find({ follower: userId }).exec();
    return follows.map(follow => follow.following);
  }

}

import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'; // Import InjectModel from @nestjs/mongoose
import { Model } from 'mongoose'; // Import Model from mongoose
import { CreateTweetDto } from './dto/create-tweet.dto';
import { Tweet } from './schema/tweet.schema';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { DeleteTweetDto } from './dto/delete-tweet.dto';

@Injectable()
export class TweetService {
  constructor(
    @InjectModel(Tweet.name) // Use InjectModel to inject the Mongoose model
    private readonly tweetModel: Model<Tweet>,
  ) { }

  async createTweet(createTweetDto: CreateTweetDto, userId: string): Promise<Tweet> {
    const tweet = new this.tweetModel({
      ...createTweetDto,
      userId: userId.toString(),
      createdAt: new Date(),
    });

    const res = await tweet.save();
    return res;
  }

  async getAllTweets() {
    return this.tweetModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $addFields: {
          username: { $arrayElemAt: ['$userDetails.username', 0] },
        },
      },
      {
        $project: {
          userDetails: 0,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]).exec();
  }

  async getTweetsWithFollowingStatus(userId: string, followingUsers?: string[]): Promise<any[]> {
    let aggregateQuery = []

    if (followingUsers) {
      aggregateQuery.push({
        $match: {
          userId: { $in: followingUsers },
        },
      });
    }
    const tweetsWithFollowingStatus = await this.tweetModel.aggregate([
      ...aggregateQuery,
      {
        $lookup: {
          from: 'follows', // Replace with the actual collection name for follows
          let: { tweetAuthorId: '$userId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$follower', userId] },
                    { $eq: ['$following', '$$tweetAuthorId'] },
                  ],
                },
              },
            },
          ],
          as: 'followingStatus',
        },
      },
      {
        $addFields: {
          isUserFollowing: {
            $cond: {
              if: { $eq: [{ $size: '$followingStatus' }, 1] },
              then: true,
              else: false,
            },
          },
          isCurrentUserAuthor: {
            $eq: ['$userId', userId],
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $addFields: {
          username: { $arrayElemAt: ['$userDetails.username', 0] },
        },
      },
      {
        $project: {
          userDetails: 0,
          followingStatus: 0,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    return tweetsWithFollowingStatus;
  }

  async updateTweet(req: UpdateTweetDto, userId: string) {
    const tweet: Tweet = await this.tweetModel.findOne({ _id: req.id }).lean().exec();
    try {
      if (tweet.userId.toString() === userId.toString()) {
        await this.tweetModel.findByIdAndUpdate(
          req.id,
          { content: req.content },
          { new: true }
        );
        return "Successfully Updated"
      }
      throw new MethodNotAllowedException("Can't Update others Tweet")
    }
    catch(error){
      throw new Error(error);
    }
  }

  async deleteTweet(req: DeleteTweetDto, userId: string){
    const tweet: Tweet = await this.tweetModel.findOne({ _id: req.id }).lean().exec();
    try {
      if (tweet.userId.toString() === userId.toString()) {
        await this.tweetModel.findByIdAndDelete(req.id);
        return "Successfully Deleted"
      }
      throw new MethodNotAllowedException("Can't Delete others Tweet")
    }
    catch(error){
      throw new Error(error);
    }
  }

}

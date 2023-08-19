import { Controller, Post, Get, Body, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { JwtAuthGuard } from '../authorization/jwt-auth-guard';
import { FollowService } from '../follow/follow.service';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { DeleteTweetDto } from './dto/delete-tweet.dto';

@Controller('tweets')
export class TweetController {
  constructor(
    private readonly tweetService: TweetService,
    private readonly followService: FollowService,
  ) { }

  @Post("create-tweet")
  @UseGuards(JwtAuthGuard)
  async createTweet(@Body() createTweetDto: CreateTweetDto, @Req() req): Promise<any> {
    const userId = req.user._id;
    return this.tweetService.createTweet(createTweetDto, userId);
  }

  @Get("get-all-tweets")
  async getAllTweets(@Res() response) {
    const tweets = await this.tweetService.getAllTweets();
    return response.status(HttpStatus.OK).json(tweets);
  }

  @Get("get-all-tweets-by-user")
  @UseGuards(JwtAuthGuard)
  async getAllTweetsByUser(@Res() response, @Req() req) {
    const userId = req.user._id;
    const tweets = await this.tweetService.getTweetsWithFollowingStatus(userId);
    return response.status(HttpStatus.OK).json(tweets);
  }

  @Get("get-following-users-tweets")
  @UseGuards(JwtAuthGuard)
  async getFollowingUserTweets(@Res() response, @Req() req) {
    const userId = req.user._id;
    const followingUsers = await this.followService.getFollowingUsers(userId);
    const tweets = await this.tweetService.getTweetsWithFollowingStatus(userId, followingUsers);
    return response.status(HttpStatus.OK).json(tweets);
  }

  @Get("get-user-tweets")
  @UseGuards(JwtAuthGuard)
  async getUserTweet(@Res() response, @Req() req) {
    const userId = req.user._id;
    const tweets = await this.tweetService.getTweetsWithFollowingStatus(userId, [userId]);
    return response.status(HttpStatus.OK).json(tweets);
  }

  @Post("update-tweet")
  @UseGuards(JwtAuthGuard)
  async updateTweet(@Body() body: UpdateTweetDto, @Res() response, @Req() req) {
    const userId = req.user._id;
    const tweets = await this.tweetService.updateTweet(body, userId);
    return response.status(HttpStatus.OK).json(tweets);
  }

  @Post("delete-tweet")
  @UseGuards(JwtAuthGuard)
  async deleteTweet(@Body() body: DeleteTweetDto, @Res() response, @Req() req) {
    const userId = req.user._id;
    const tweets = await this.tweetService.deleteTweet(body, userId);
    return response.status(HttpStatus.OK).json(tweets);
  }
}

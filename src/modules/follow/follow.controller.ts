import { Controller, Post, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from '../authorization/jwt-auth-guard';

@Controller('follow')
export class FollowController {
    constructor(private readonly followService: FollowService) { }

    @Post('/followUser/:followingId')
    @UseGuards(JwtAuthGuard)
    async followUser(@Param('followingId') followingId: string, @Req() req) {
        const userId = req.user._id;
        return this.followService.followUser(userId, followingId);
    }

    @Post('/unfollowUser/:followingId')
    @UseGuards(JwtAuthGuard)
    async unfollowUser(@Param('followingId') followingId: string,@Req() req) {
        const userId = req.user._id;
        return this.followService.unfollowUser(userId, followingId);
    }
}

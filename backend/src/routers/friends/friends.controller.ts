// src/routers/friends/friends.controller.ts
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { FriendsService } from './friends.service';
import { SendFriendRequestDto } from './dto/send-friend-request.dto';
import { User } from '../../decorators/user.decorator';
import type { JwtPayload } from '../../common/types';

@ApiTags('Friends')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('friends')
export class FriendsController {
	constructor(private friendsService: FriendsService) {}

	@ApiOperation({ summary: '내 친구 목록 조회' })
	@Get()
	getMyFriends(@User() user: JwtPayload) {
		return this.friendsService.getMyFriends(user.sub);
	}

	@ApiOperation({ summary: '받은 친구 요청 목록 조회' })
	@Get('requests/received')
	getReceivedRequests(@User() user: JwtPayload) {
		return this.friendsService.getReceivedRequests(user.sub);
	}

	@ApiOperation({ summary: '보낸 친구 요청 목록 조회' })
	@Get('requests/sent')
	getSentRequests(@User() user: JwtPayload) {
		return this.friendsService.getSentRequests(user.sub);
	}

	@ApiOperation({ summary: '친구 요청 보내기' })
	@Post('requests')
	sendFriendRequest(@User() user: JwtPayload, @Body() dto: SendFriendRequestDto) {
		return this.friendsService.sendFriendRequest(user.sub, dto);
	}

	@ApiOperation({ summary: '친구 요청 수락' })
	@Post('requests/:requestId/accept')
	acceptFriendRequest(@User() user: JwtPayload, @Param('requestId', ParseIntPipe) requestId: number) {
		return this.friendsService.acceptFriendRequest(user.sub, requestId);
	}

	@ApiOperation({ summary: '친구 요청 거절' })
	@Post('requests/:requestId/reject')
	rejectFriendRequest(@User() user: JwtPayload, @Param('requestId', ParseIntPipe) requestId: number) {
		return this.friendsService.rejectFriendRequest(user.sub, requestId);
	}

	@ApiOperation({ summary: '친구 삭제' })
	@Delete(':friendshipId')
	removeFriend(@User() user: JwtPayload, @Param('friendshipId', ParseIntPipe) friendshipId: number) {
		return this.friendsService.removeFriend(user.sub, friendshipId);
	}

	@ApiOperation({ summary: '사용자 차단' })
	@Post('block/:targetUserId')
	blockUser(@User() user: JwtPayload, @Param('targetUserId', ParseIntPipe) targetUserId: number) {
		return this.friendsService.blockUser(user.sub, targetUserId);
	}

	@ApiOperation({ summary: '차단 해제' })
	@Delete('block/:targetUserId')
	unblockUser(@User() user: JwtPayload, @Param('targetUserId', ParseIntPipe) targetUserId: number) {
		return this.friendsService.unblockUser(user.sub, targetUserId);
	}

	@ApiOperation({ summary: '차단 목록 조회' })
	@Get('blocked')
	getBlockedUsers(@User() user: JwtPayload) {
		return this.friendsService.getBlockedUsers(user.sub);
	}
}


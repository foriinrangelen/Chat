import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { User } from '../../decorators/user.decorator';
import type { JwtPayload } from '../../common/types';

@ApiTags('Channels')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('channels')
export class ChannelsController {
	constructor(private channelsService: ChannelsService) {}

	@ApiOperation({ summary: '워크스페이스의 채널 목록 조회' })
	@ApiQuery({ name: 'workspaceId', type: Number })
	@Get()
	getChannels(@User() user: JwtPayload, @Query('workspaceId', ParseIntPipe) workspaceId: number) {
		return this.channelsService.getChannels(workspaceId, user.sub);
	}

	@ApiOperation({ summary: '채널 생성' })
	@Post()
	createChannel(@User() user: JwtPayload, @Body() dto: CreateChannelDto) {
		return this.channelsService.createChannel(user.sub, dto);
	}

	@ApiOperation({ summary: '채널 상세 조회' })
	@Get(':id')
	getChannel(@User() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
		return this.channelsService.getChannel(id, user.sub);
	}

	@ApiOperation({ summary: '채널 메시지 조회' })
	@ApiQuery({ name: 'page', type: Number, required: false })
	@ApiQuery({ name: 'limit', type: Number, required: false })
	@Get(':id/messages')
	getMessages(
		@User() user: JwtPayload,
		@Param('id', ParseIntPipe) id: number,
		@Query('page') page?: number,
		@Query('limit') limit?: number,
	) {
		return this.channelsService.getMessages(id, user.sub, page || 1, limit || 50);
	}

	@ApiOperation({ summary: '메시지 전송' })
	@Post(':id/messages')
	sendMessage(@User() user: JwtPayload, @Param('id', ParseIntPipe) id: number, @Body() dto: SendMessageDto) {
		return this.channelsService.sendMessage(id, user.sub, dto);
	}

	@ApiOperation({ summary: '채널 참가' })
	@Post(':id/join')
	joinChannel(@User() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
		return this.channelsService.joinChannel(id, user.sub);
	}
}

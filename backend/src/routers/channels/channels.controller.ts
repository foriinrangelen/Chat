// src/routers/channels/channels.controller.ts
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { SendMessageDto, EditMessageDto } from './dto/send-message.dto';
import { User } from '../../decorators/user.decorator';
import type { JwtPayload } from '../../common/types';

@ApiTags('Channels')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('channels')
export class ChannelsController {
	constructor(private channelsService: ChannelsService) {}

	// =========================================================================
	// 채널 관련 API
	// =========================================================================

	@ApiOperation({ summary: '내 채널 목록 조회' })
	@Get()
	getMyChannels(@User() user: JwtPayload) {
		return this.channelsService.getMyChannels(user.sub);
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

	@ApiOperation({ summary: '채널 참가' })
	@Post(':id/join')
	joinChannel(@User() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
		return this.channelsService.joinChannel(id, user.sub);
	}

	@ApiOperation({ summary: '채널 나가기' })
	@Post(':id/leave')
	leaveChannel(@User() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
		return this.channelsService.leaveChannel(id, user.sub);
	}

	// =========================================================================
	// 워크스페이스 관련 API
	// =========================================================================

	@ApiOperation({ summary: '채널의 워크스페이스 목록 조회' })
	@Get(':id/workspaces')
	getWorkspaces(@User() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
		return this.channelsService.getWorkspaces(id, user.sub);
	}

	@ApiOperation({ summary: '워크스페이스 생성' })
	@Post(':id/workspaces')
	createWorkspace(@User() user: JwtPayload, @Param('id', ParseIntPipe) id: number, @Body() dto: CreateWorkspaceDto) {
		return this.channelsService.createWorkspace(id, user.sub, dto);
	}

	// =========================================================================
	// 메시지 관련 API
	// =========================================================================

	@ApiOperation({ summary: '워크스페이스 메시지 조회' })
	@ApiQuery({ name: 'page', type: Number, required: false })
	@ApiQuery({ name: 'limit', type: Number, required: false })
	@Get('workspaces/:workspaceId/messages')
	getMessages(
		@User() user: JwtPayload,
		@Param('workspaceId', ParseIntPipe) workspaceId: number,
		@Query('page') page?: number,
		@Query('limit') limit?: number,
	) {
		return this.channelsService.getMessages(workspaceId, user.sub, page || 1, limit || 50);
	}

	@ApiOperation({ summary: '워크스페이스 메시지 전송' })
	@Post('workspaces/:workspaceId/messages')
	sendMessage(
		@User() user: JwtPayload,
		@Param('workspaceId', ParseIntPipe) workspaceId: number,
		@Body() dto: SendMessageDto,
	) {
		return this.channelsService.sendMessage(workspaceId, user.sub, dto);
	}

	@ApiOperation({ summary: '메시지 수정' })
	@Patch('messages/:messageId')
	editMessage(
		@User() user: JwtPayload,
		@Param('messageId', ParseIntPipe) messageId: number,
		@Body() dto: EditMessageDto,
	) {
		return this.channelsService.editMessage(messageId, user.sub, dto.content);
	}

	@ApiOperation({ summary: '메시지 삭제' })
	@Delete('messages/:messageId')
	deleteMessage(@User() user: JwtPayload, @Param('messageId', ParseIntPipe) messageId: number) {
		return this.channelsService.deleteMessage(messageId, user.sub);
	}
}

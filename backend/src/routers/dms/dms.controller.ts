import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { DmsService } from './dms.service';
import { CreateDmDto } from './dto/create-dm.dto';
import { SendDmDto } from './dto/send-dm.dto';
import { User } from '../../decorators/user.decorator';
import type { JwtPayload } from '../../common/types';

@ApiTags('DMs')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('dms')
export class DmsController {
	constructor(private dmsService: DmsService) {}

	@ApiOperation({ summary: '내 DM 목록 조회' })
	@ApiQuery({ name: 'workspaceId', type: Number })
	@Get()
	getMyDms(@User() user: JwtPayload, @Query('workspaceId', ParseIntPipe) workspaceId: number) {
		return this.dmsService.getMyDms(user.sub, workspaceId);
	}

	@ApiOperation({ summary: 'DM 생성 또는 조회' })
	@Post()
	createOrGetDm(@User() user: JwtPayload, @Body() dto: CreateDmDto) {
		return this.dmsService.createOrGetDm(user.sub, dto);
	}

	@ApiOperation({ summary: 'DM 메시지 조회' })
	@ApiQuery({ name: 'page', type: Number, required: false })
	@ApiQuery({ name: 'limit', type: Number, required: false })
	@Get(':id/messages')
	getMessages(
		@User() user: JwtPayload,
		@Param('id', ParseIntPipe) id: number,
		@Query('page') page?: number,
		@Query('limit') limit?: number,
	) {
		return this.dmsService.getMessages(id, user.sub, page || 1, limit || 50);
	}

	@ApiOperation({ summary: 'DM 메시지 전송' })
	@Post(':id/messages')
	sendMessage(@User() user: JwtPayload, @Param('id', ParseIntPipe) id: number, @Body() dto: SendDmDto) {
		return this.dmsService.sendMessage(id, user.sub, dto);
	}
}

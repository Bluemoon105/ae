import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { AuthGuard } from 'src/shared/guard/auth.guard';
import { RolesGuard } from 'src/shared/guard/roles.guard';
import { AdminService } from './admin.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { BlockUserDto } from './dto/block-user.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // admin.controller.ts
  @Delete('user/:userId/delete')
  @ApiOperation({ summary: '관리자용 유저 삭제', description: '관리자가 특정 사용자를 삭제합니다.' })
  async deleteUser(@Param('userId') userId: string) {
    return this.adminService.deleteUser(userId);
  }

  @Delete('post/:postId')
  @ApiOperation({ summary: '관리자용 게시글 삭제', description: '관리자가 특정 게시글을 삭제합니다.' })
  async deletePost(@Param('postId') postId: string) {
    return this.adminService.deletePost(postId);
  }

  @Post('notice')
  @ApiOperation({ summary: '관리자용 공지사항 등록', description: '관리자가 새로운 공지사항을 등록합니다.' })
  async createNotice(@Body() dto: CreateNoticeDto) {
    return this.adminService.createNotice(dto);
  }

  @Post('event') 
  @ApiOperation({ summary: '관리자용 이벤트 등록', description: '관리자가 새로운 이벤트를 등록합니다.' })
  async createEvent(@Body() dto: CreateEventDto) {
    return this.adminService.createEvent(dto);
  }

  @Patch(':userId/block')
  @ApiOperation({ summary: '관리자용 유저 차단', description: '관리자가 특정 사용자를 차단합니다.' })
  async blockUser(@Param('userId') userId: string) {
    return this.adminService.setUserBlockStatus(userId, true);
  }

  @Patch(':userId/unblock')
  @ApiOperation({ summary: '관리자용 유저 차단 해제', description: '관리자가 특정 사용자의 차단을 해제합니다.' })
  async unblockUser(@Param('userId') userId: string) {
    return this.adminService.setUserBlockStatus(userId, false);
  }

}


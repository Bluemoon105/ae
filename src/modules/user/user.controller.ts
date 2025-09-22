import { Body, Controller, Get, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { AuthGuard } from 'src/shared/guard/auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateMyInfoDto } from './dto/update-my-info.dto';

@UseGuards(AuthGuard) // 로그인한 사용자만 접근 가능
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMyInfo(@CurrentUser('sub')userId: string) {
    return this.userService.getMyInfo(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: '내 정보 수정', description: '현재 로그인한 사용자의 정보를 수정합니다.' })
  async updateMyInfo(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateMyInfoDto,
  ) {
    return this.userService.updateMyInfo(userId, dto);
  }

  @Delete('me')
  @ApiOperation({ summary: '회원 탈퇴', description: '현재 로그인한 사용자의 계정을 삭제합니다.' })
  async deleteMyAccount(@CurrentUser('sub') userId: string) {
    return this.userService.deleteMyAccount(userId);
  }
}

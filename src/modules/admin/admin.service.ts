import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { BlockUserDto } from './dto/block-user.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}
  
// admin.service.ts
async deleteUser(userId: string) {
  const user = await this.prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundException('해당 사용자가 없습니다.');
  await this.prisma.user.delete({ where: { id: userId } });
  return { message: '사용자가 성공적으로 삭제되었습니다.' };
}

   async deletePost(postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('해당 게시물이 없습니다.');
    await this.prisma.post.delete({ where: { id: postId } });
    return { message: '게시물이 삭제되었습니다.' };
  }

  async createNotice(dto: CreateNoticeDto) {
    const notice = await this.prisma.notice.create({ data: dto });
    return { message: '공지사항이 등록되었습니다.', notice };
  }

   async createEvent(dto: CreateEventDto) {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new BadRequestException('유효하지 않은 날짜 형식입니다. ISO 8601 형식으로 전달하세요.');
    }

    if (end <= start) {
      throw new BadRequestException('종료 시간이 시작 시간보다 빠를 수 없습니다.');
    }

    const event = await this.prisma.event.create({
      data: {
        title: dto.title,
        description: dto.description,
        startTime: start,
        endTime: end,
      },
    });

    return { message: '이벤트가 등록되었습니다.', event };
  }

  async setUserBlockStatus(userId: string, isBlocked: boolean) {
    // 유저 존재 확인
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('해당 유저가 존재하지 않습니다.');
    }

    // 차단 상태 업데이트
    await this.prisma.user.update({
      where: { id: userId },
      data: { isBlocked },
    });

    return {
      message: `유저가 ${isBlocked ? '차단' : '차단 해제'}되었습니다.`,
      userId,
      isBlocked,
    };
  }
}

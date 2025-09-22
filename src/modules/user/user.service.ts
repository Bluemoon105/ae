import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { UpdateMyInfoDto } from './dto/update-my-info.dto';


@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyInfo(userId: string) {
    if (!userId) {
      throw new BadRequestException('userId가 없습니다.');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId, // 반드시 값이 있어야 함
      },
      select: {
        id: true,
        name: true,
        nickname: true,
        createdAt: true,
        profileImage: true,
        point: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    }

    return user;
  }

  async updateMyInfo( userId: string, dto: UpdateMyInfoDto) {
    const {nickname, profileImage} = dto;

    if (nickname) {
      const existingUser = await this.prisma.user.findUnique({
        where: { nickname },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException('이미 사용 중인 닉네임입니다.');
      }

      return this.prisma.user.update({
        where: { id: userId },
        data: {
          nickname,
          profileImage,
        },
        select: {
          id: true,
          name: true,
          email:true,
          nickname: true,
          profileImage: true,
          updatedAt: true,
        },
      });
    }
  }

  async deleteMyAccount(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('해당 사용자가 없습니다.');
    await this.prisma.user.delete({ where: { id: userId } });
    return { message: '계정이 성공적으로 삭제되었습니다.' };
  }
}

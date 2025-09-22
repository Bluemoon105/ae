import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';

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

}

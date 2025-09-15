import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './shared/prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { EventModule } from './event/event.module';
import { MembershipModule } from './membership/membership.module';
import { NoticeModule } from './notice/notice.module';
import { NotificationModule } from './notification/notification.module';
import { ShopModule } from './shop/shop.module';
import { ContentsModule } from './contents/contents.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, PostModule, EventModule, MembershipModule, NoticeModule, NotificationModule, ShopModule, ContentsModule, AdminModule] ,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
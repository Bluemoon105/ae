import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './shared/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { EventModule } from './modules/event/event.module';
import { MembershipModule } from './modules/membership/membership.module';
import { NoticeModule } from './modules/notice/notice.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ShopModule } from './modules/shop/shop.module';
import { ContentsModule } from './modules/contents/contents.module';
import { AdminModule } from './modules/admin/admin.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, 
    UserModule, 
    AuthModule, 
    PostModule,
    EventModule, 
    MembershipModule, 
    NoticeModule, 
    NotificationModule, 
    ShopModule, 
    ContentsModule, 
    AdminModule
  ] ,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
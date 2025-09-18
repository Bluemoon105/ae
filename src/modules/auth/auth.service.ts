import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './dto/payload.interface';
import { User, UserRole } from '@prisma/client';
import { Response, Request } from 'express';
import { RegisterDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, nickname, name, profileImage } = registerDto;

    // 이메일/닉네임 중복 체크
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { nickname }],
      },
    });

    if (existingUser) {
      throw new BadRequestException('이미 존재하는 이메일 또는 닉네임입니다.');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname,
        name,
        profileImage,
        role: UserRole.FAN_FREE, // 가입 시 무조건 FAN_FREE
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        name: true,
        profileImage: true,
        role: true,
      },
    });

    return user;
  }

  /**
   * 로그인 및 토큰 발급
   */
  async login(
    loginDto: LoginDto,
    res: Response,
  ): Promise<{ user: Partial<User>; accessToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // 반환할 유저 정보 (민감한 데이터 제외)
    const userInfo = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      name: user.name,
      role: user.role,
      profileImage: user.profileImage,
    };

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role, // role을 type처럼 사용
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN || '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN || '7d',
    });

    // ✅ Refresh Token을 쿠키에만 저장 (DB 저장 X)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // HTTPS 환경에서만 전송
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    return { user: userInfo, accessToken };
  }

  /**
   * 리프레시 토큰으로 액세스 토큰 재발급
   */
  async refresh(req: Request): Promise<{ accessToken: string }> {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('리프레시 토큰이 없습니다.');
    }

    try {
      const decoded = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });

      const newAccessToken = await this.jwtService.signAsync(
        { sub: decoded.sub, email: decoded.email, type: decoded.role },
        {
          secret: process.env.ACCESS_TOKEN_SECRET,
          expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN || '15m',
        },
      );

      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }
  }

  /**
   * 로그아웃 (쿠키 제거)
   */
 async logout(userId: string): Promise<{ message: string }> {
    // ✅ DB의 refreshToken 제거
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return { message: '성공적으로 로그아웃되었습니다.' };
  }

    async verifyAccessToken(token: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      return payload;
    } catch (error) {
      console.error('verifyAccessToken error:', error);
      throw new UnauthorizedException('유효하지 않은 액세스 토큰입니다.');
    }
  }

  async verifyRefreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });

      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('유효하지 않은 refresh token입니다.');
      }

      const newAccessToken = await this.jwtService.signAsync(
        { sub: payload.sub, email: payload.email, role: payload.role },
        { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '15m' },
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      console.error('verifyRefreshToken error:', error);
      throw new UnauthorizedException('유효하지 않은 refresh token입니다.');
    }
  }
}

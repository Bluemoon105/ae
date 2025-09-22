// src/shared/guard/roles.guard.ts
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/shared/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 컨트롤러/핸들러에 @Roles로 지정된 역할 가져오기
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      // 역할이 지정되지 않은 경우, 접근 허용
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('사용자 정보가 없거나 권한이 없습니다.');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('권한이 없는 사용자입니다.');
    }

    return true;
  }
}

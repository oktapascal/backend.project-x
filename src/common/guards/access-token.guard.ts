import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [context.getHandler(), context.getClass()]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest() as Request;

    // jika request tidak menyertakan authroization
    // maka akan mengecek apakah ada cookie yang dikirim
    // jika ada cookie session maka akan ditambahkan menjadi header authorziation
    if (!request.headers['authorization']) {
      const cookies = request.cookies;

      if (cookies['session-access-token']) {
        request.headers['authorization'] = `Bearer ${cookies['session-access-token']}`;
      }
    }

    return super.canActivate(context);
  }
}

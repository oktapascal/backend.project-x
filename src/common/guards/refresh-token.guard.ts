import { AuthGuard } from '@nestjs/passport';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') implements CanActivate {
  constructor(private props: any) {
    super(props);
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;

    // jika request tidak menyertakan authroization
    // maka akan mengecek apakah ada cookie yang dikirim
    // jika ada cookie session maka akan ditambahkan menjadi header authorziation
    if (!request.headers['authorization']) {
      const cookies = request.cookies;

      if (cookies['session-refresh-token']) {
        request.headers['authorization'] = `Bearer ${cookies['session-refresh-token']}`;
      }
    }

    return super.canActivate(context);
  }
}

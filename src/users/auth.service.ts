import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from '../common/helpers';
import { USERS_SERVICES, UsersServices } from './users.service';
import { SigninRequest, RefreshTokenRequest } from './requests';
import { AUTH_REPOSITORIES, AuthRepositories } from './auth.repositories';
import {
  TOKEN_MANAGER_SERVICES,
  TokenManagerServices,
} from './token-manager.service';
import { AuthSessionDto } from './dto';
import { User } from './entities';

export const AUTH_SERVICES = 'AuthServices';

export interface AuthServices {
  RefreshToken(auth: RefreshTokenRequest): Promise<string[]>;
  SignIn(auth: SigninRequest): Promise<string[]>;
  SignOut(user_id: string): Promise<void>;
  GetCredentialData(user_id: string): Promise<User>;
}

@Injectable()
export class AuthServicesImpl implements AuthServices {
  constructor(
    @Inject(USERS_SERVICES)
    private readonly userServices: UsersServices,
    @Inject(TOKEN_MANAGER_SERVICES)
    private readonly tokenmanagerServices: TokenManagerServices,
    @Inject(AUTH_REPOSITORIES)
    private readonly authRepositories: AuthRepositories,
  ) {}

  GetCredentialData(user_id: string): Promise<User> {
    return this.userServices.GetUserById(user_id);
  }

  async RefreshToken(auth: RefreshTokenRequest): Promise<string[]> {
    const user = await this.userServices.GetUserById(auth.user_id);

    if (!user) throw new ForbiddenException('Access Denied');

    if (user.remember_token === null)
      throw new ForbiddenException('Access Denied');

    const isVerified = await verify(user.remember_token, auth.token);

    if (!isVerified) throw new ForbiddenException('Access Denied');

    const accessToken = await this.tokenmanagerServices.NewAccessToken(
      user.user_id,
    );

    const refreshToken = await this.tokenmanagerServices.NewRefreshToken(
      user.user_id,
    );

    await this.userServices.UpdateRefreshToken(auth.user_id, refreshToken);

    return [accessToken, refreshToken];
  }

  async SignIn(auth: SigninRequest): Promise<string[]> {
    const user = await this.userServices.GetUserByUsername(auth.username);

    if (!user)
      throw new NotFoundException([
        { field: 'username', error: 'user tidak ditemukan' },
      ]);

    const isVerified = await verify(user.password, auth.password);

    if (!isVerified)
      throw new UnauthorizedException([
        {
          field: 'password',
          error: 'password tidak sesuai dengan credential anda',
        },
      ]);

    const accessToken = await this.tokenmanagerServices.NewAccessToken(
      user.user_id,
    );

    const refreshToken = await this.tokenmanagerServices.NewRefreshToken(
      user.user_id,
    );

    await this.userServices.UpdateRefreshToken(user.user_id, refreshToken);

    const dto = new AuthSessionDto();
    dto.user_agent = auth.user_agent;
    dto.ip_address = auth.ip_address;
    dto.user_id = user.user_id;

    await this.authRepositories.CreateAuthSession(dto);

    return [accessToken, refreshToken];
  }

  SignOut(user_id: string): Promise<void> {
    return this.userServices.UpdateRefreshToken(user_id, null);
  }
}
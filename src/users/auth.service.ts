import { ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { verify } from '../common/helpers';
import { USERS_SERVICES, UsersServices } from './users.service';
import { SigninRequest, RefreshTokenRequest } from './requests';
import { AUTH_REPOSITORIES, AuthRepositories } from './auth.repositories';
import { TOKEN_MANAGER_SERVICES, TokenManagerServices } from './token-manager.service';
import { AuthSessionDto } from './dto';
import { User } from './entities';
import { SessionPayload } from './web';

export const AUTH_SERVICES = 'AuthServices';

export interface AuthServices {
  RefreshToken(auth: RefreshTokenRequest): Promise<string[]>;
  SignIn(auth: SigninRequest): Promise<SessionPayload>;
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
    const token = await this.authRepositories.GetRefreshToken(auth.user_id);

    if (!token) throw new ForbiddenException('Access Denied');

    const isVerified = await verify(token, auth.token);

    if (!isVerified) throw new ForbiddenException('Access Denied');

    const accessToken = await this.tokenmanagerServices.NewAccessToken(auth.user_id);

    const refreshToken = await this.tokenmanagerServices.NewRefreshToken(auth.user_id);

    await this.authRepositories.SaveRefreshToken(auth.user_id, refreshToken);

    return [accessToken, refreshToken];
  }

  async SignIn(auth: SigninRequest): Promise<SessionPayload> {
    const user = await this.userServices.GetUserByUsername(auth.username);

    if (!user) throw new NotFoundException([{ username: 'user tidak ditemukan' }]);

    const isVerified = await verify(user.password, auth.password);

    if (!isVerified)
      throw new UnauthorizedException([
        {
          password: 'password tidak sesuai dengan credential anda',
        },
      ]);

    const accessToken = await this.tokenmanagerServices.NewAccessToken(user.user_id);

    const refreshToken = await this.tokenmanagerServices.NewRefreshToken(user.user_id);

    await this.authRepositories.SaveRefreshToken(user.user_id, refreshToken);

    const dto = new AuthSessionDto();
    dto.user_agent = auth.user_agent;
    dto.ip_address = auth.ip_address;
    dto.user_id = user.user_id;

    await this.authRepositories.CreateAuthSession(dto);

    delete user.id;
    delete user.password;
    delete user.created_at;
    delete user.activated;
    delete user.role_id;

    return { access_token: accessToken, refresh_token: refreshToken, user };
  }

  SignOut(user_id: string): Promise<void> {
    return this.authRepositories.DeleteRefreshToken(user_id);
  }
}

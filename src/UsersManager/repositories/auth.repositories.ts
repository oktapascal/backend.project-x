import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AuthSessionDto } from '../dto';
import { AuthSession } from '../entities';
import { hashing } from '../../common/helpers';

export const AUTH_REPOSITORIES = 'AuthRepositories';

export interface AuthRepositories {
  CreateAuthSession(session: AuthSessionDto): Promise<void>;
  GetRefreshToken(user_id: string): Promise<string>;
  SaveRefreshToken(user_id: string, token?: string): Promise<void>;
  DeleteRefreshToken(user_id: string): Promise<void>;
}

@Injectable()
export class AuthRepositoriesImpl implements AuthRepositories {
  constructor(
    @InjectDataSource() private readonly datasource: DataSource,
    @Inject(CACHE_MANAGER) private readonly cachesource: Cache,
  ) {}

  async CreateAuthSession(session: AuthSessionDto): Promise<void> {
    const manager = this.datasource.createEntityManager();

    const createSession = manager.create(AuthSession, {
      user_id: session.user_id,
      ip_address: session.ip_address,
      user_agent: session.user_agent,
    });

    manager.save(createSession);
  }

  async SaveRefreshToken(user_id: string, token?: string): Promise<void> {
    const _token = await hashing(token);
    return this.cachesource.set(user_id, _token, 604800); // 7 hari
  }

  GetRefreshToken(user_id: string): Promise<string> {
    return this.cachesource.get(user_id);
  }

  DeleteRefreshToken(user_id: string): Promise<void> {
    return this.cachesource.del(user_id);
  }
}

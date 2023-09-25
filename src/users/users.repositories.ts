import { User, UserProfile } from './entities';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserDto, UserProfileDto } from './dto';

export const USERS_REPOSITORIES = 'UsersRepositories';

export interface UsersRepositories {
  GetUserByUsername(username: string): Promise<User>;
  GetUserById(user_id: string): Promise<User>;
  GetLastUserId(): Promise<User>;
  CreateUser(user: UserDto, profile: UserProfileDto): Promise<User>;
}

@Injectable()
export class UsersRepositoriesImpl implements UsersRepositories {
  constructor(@InjectDataSource() private readonly datasource: DataSource) {}

  CreateUser(user: UserDto, profile: UserProfileDto): Promise<User> {
    const manager = this.datasource.createEntityManager();

    return this.datasource.transaction(async (trx) => {
      const createUser = manager.create(User, {
        user_id: user.user_id,
        username: user.username,
        password: user.password,
        role_id: user.role,
        activated: true,
      });

      const createProfile = manager.create(UserProfile, {
        user_id: user.user_id,
        full_name: profile.full_name,
      });

      const result = await trx.save(createUser);
      await trx.save(createProfile);

      return result;
    });
  }

  GetUserById(user_id: string): Promise<User> {
    return this.datasource
      .getRepository(User)
      .createQueryBuilder('users')
      .innerJoinAndMapOne('users.profile', 'user_profiles', 'profile', 'users.user_id = profile.user_id')
      .where('users.user_id = :user_id', { user_id })
      .andWhere('activated = true')
      .getOne();
  }

  GetUserByUsername(username: string): Promise<User> {
    return this.datasource
      .getRepository(User)
      .createQueryBuilder('users')
      .innerJoinAndMapOne('users.profile', 'user_profiles', 'profile', 'users.user_id = profile.user_id')
      .where('username = :username', { username })
      .andWhere('activated = true')
      .getOne();
  }

  GetLastUserId(): Promise<User> {
    return this.datasource.getRepository(User).createQueryBuilder().orderBy('id', 'DESC').getOne();
  }
}

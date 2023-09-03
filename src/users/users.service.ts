import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from './entities';
import { USERS_REPOSITORIES, UsersRepositories } from './users.repositories';
import { CreateUserRequest } from './requests';
import { generateUUID, hashing } from '../common/helpers';
import { UserDto, UserProfileDto } from './dto';

export const USERS_SERVICES = 'UsersServices';

export interface UsersServices {
  GetUserByUsername(username: string): Promise<User>;
  GetUserById(user_id: string): Promise<User>;
  SaveUser(user: CreateUserRequest): Promise<User>;
  UpdateRefreshToken(user_id: string, token?: string): Promise<void>;
}

@Injectable()
export class UsersServiceImpl implements UsersServices {
  constructor(
    @Inject(USERS_REPOSITORIES)
    private readonly userRepository: UsersRepositories,
  ) {}

  GetUserById(user_id: string): Promise<User> {
    return this.userRepository.GetUserById(user_id);
  }

  GetUserByUsername(username: string): Promise<User> {
    return this.userRepository.GetUserByUsername(username);
  }

  async SaveUser(user: CreateUserRequest): Promise<User> {
    const _user = await this.GetUserByUsername(user.username);

    if (_user)
      throw new BadRequestException([
        {
          field: 'username',
          error: 'Username yang sama sudah terdaftar',
        },
      ]);

    const uuid = generateUUID();

    const dtoUser = new UserDto();
    dtoUser.user_id = uuid;
    dtoUser.username = user.username;
    dtoUser.password = await hashing(user.password);
    dtoUser.role = user.role;
    dtoUser.activated = true;

    const dtoProfile = new UserProfileDto();
    dtoProfile.user_id = uuid;
    dtoProfile.full_name = user.full_name;
    dtoProfile.phone_number = user.phone_number;
    dtoProfile.email = user.email;

    return this.userRepository.CreateUser(dtoUser, dtoProfile);
  }

  async UpdateRefreshToken(user_id: string, token?: string): Promise<void> {
    if (token !== null) {
      token = await hashing(token);
    }

    return this.userRepository.UpdateRefreshToken(user_id, token);
  }
}

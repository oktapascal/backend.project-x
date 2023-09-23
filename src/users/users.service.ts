import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from './entities';
import { USERS_REPOSITORIES, UsersRepositories } from './users.repositories';
import { CreateUserRequest } from './requests';
import { hashing } from '../common/helpers';
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

  private async NewUserId(): Promise<string> {
    const result = await this.GenerateUserId();

    if (!result) return 'USR.00001';

    const temp = result.user_id.split('.');

    const prefix = temp[0];
    const newNumber = parseInt(temp[1]) + 1;

    const length = newNumber.toString().length;

    if (length === 1) return `${prefix}.0000${newNumber}`;
    if (length === 2) return `${prefix}.000${newNumber}`;
    if (length === 3) return `${prefix}.00${newNumber}`;
    if (length === 4) return `${prefix}.0${newNumber}`;
    if (length === 5) return `${prefix}.${newNumber}`;
  }

  private GenerateUserId(): Promise<User> {
    return this.userRepository.GetLastUserId();
  }

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

    const id = await this.NewUserId();

    const dtoUser = new UserDto();
    dtoUser.user_id = id;
    dtoUser.username = user.username;
    dtoUser.password = await hashing(user.password);
    dtoUser.role = user.role;
    dtoUser.activated = true;

    const dtoProfile = new UserProfileDto();
    dtoProfile.user_id = id;
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

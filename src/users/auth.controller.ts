import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Ip,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AUTH_SERVICES, AuthServices } from './auth.service';
import { Serialize } from '../common/interceptors';
import { UserDto } from './dto';
import { CurrentUser, UserAgent } from './decorators';
import { Public } from '../common/decorators';
import { RefreshTokenRequest, SigninRequest } from './requests';
import { RefreshTokenGuard } from '../common/guards';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICES) private readonly authService: AuthServices,
  ) {}

  @Get('/whoami')
  @Serialize(UserDto)
  whoami(@CurrentUser() user: Express.User) {
    return this.authService.GetCredentialData(user['sub']);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Public()
  async login(
    @Body() request: SigninRequest,
    @Ip() ip_address: string,
    @UserAgent() user_agent: string | undefined,
    @Session() session: any,
  ) {
    request.ip_address = ip_address;
    request.user_agent = user_agent;

    const [access_token, refresh_token] =
      await this.authService.SignIn(request);

    session.access_token = access_token;
    session.refresh_token = refresh_token;

    return { access_token, refresh_token };
  }

  @Patch('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @Public()
  async refresh(@CurrentUser() user: Express.User, @Session() session: any) {
    const request = new RefreshTokenRequest();
    request.user_id = user['sub'];
    request.token = user['refresh_token'];

    const [access_token, refresh_token] =
      await this.authService.RefreshToken(request);

    session.access_token = access_token;
    session.refresh_token = refresh_token;

    return { access_token, refresh_token };
  }

  @Patch('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: Express.User, @Session() session: any) {
    await this.authService.SignOut(user['sub']);

    session.access_token = null;
    session.refresh_token = null;

    return {
      code: HttpStatus.OK,
      status: 'OK',
    };
  }
}

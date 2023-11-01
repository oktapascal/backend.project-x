import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Ip, Patch, Post, UseGuards } from '@nestjs/common';
import { AUTH_SERVICES, AuthServices } from '../services/auth.service';
import { Serialize } from '../../common/interceptors';
import { UserDto, UserSessionDto } from '../dto';
import { CurrentUser, UserAgent } from '../decorators';
import { Public } from '../../common/decorators';
import { RefreshTokenRequest, SigninRequest } from '../requests';
import { RefreshTokenGuard } from '../../common/guards';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICES) private readonly authService: AuthServices) {}

  @Get('/whoami')
  @ApiResponse({ status: HttpStatus.OK, description: 'User data based credential token' })
  @HttpCode(HttpStatus.OK)
  @Serialize(UserDto)
  async whoami(@CurrentUser() user: Express.User) {
    const response = await this.authService.GetCredentialData(user['sub']);

    return { ...response };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Serialize(UserSessionDto)
  @Public()
  async login(@Body() request: SigninRequest, @Ip() ip_address: string, @UserAgent() user_agent: string | undefined) {
    request.ip_address = ip_address;
    request.user_agent = user_agent;

    const response = await this.authService.SignIn(request);

    return { ...response };
  }

  @Patch('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @Public()
  async refresh(@CurrentUser() user: Express.User) {
    const request = new RefreshTokenRequest();
    request.user_id = user['sub'];
    request.token = user['refresh_token'];

    const [access_token, refresh_token] = await this.authService.RefreshToken(request);

    return { access_token, refresh_token };
  }

  @Patch('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: Express.User) {
    await this.authService.SignOut(user['sub']);

    return {
      code: HttpStatus.OK,
      status: 'OK',
    };
  }
}

import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Ip, Patch, Post, UseGuards, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AUTH_SERVICES, AuthServices } from '../services/auth.service';
import { Serialize } from '../../common/interceptors';
import { UserDto, UserSessionDto } from '../dto';
import { CurrentUser, UserAgent } from '../decorators';
import { Public } from '../../common/decorators';
import { RefreshTokenRequest, SigninRequest } from '../requests';
import { RefreshTokenGuard } from '../../common/guards';

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
  async login(@Body() request: SigninRequest, @Res({ passthrough: true }) responses: Response, @Ip() ip_address: string, @UserAgent() user_agent: string | undefined) {
    request.ip_address = ip_address;
    request.user_agent = user_agent;

    const response = await this.authService.SignIn(request);

    responses.cookie('session-access-token', response.access_token, {
      path: '/',
      maxAge: 900000, // 15 menit
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    responses.cookie('session-refresh-token', response.refresh_token, {
      path: '/',
      maxAge: 604800000, // 7 hari
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return { ...response };
  }

  @Patch('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @Public()
  async refresh(@CurrentUser() user: Express.User, @Res({ passthrough: true }) responses: Response) {
    const request = new RefreshTokenRequest();
    request.user_id = user['sub'];
    request.token = user['refresh_token'];

    const [access_token, refresh_token] = await this.authService.RefreshToken(request);

    responses.cookie('session-access-token', access_token, {
      path: '/',
      maxAge: 900000, // 15 menit
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    responses.cookie('session-refresh-token', refresh_token, {
      path: '/',
      maxAge: 604800000, // 7 hari
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return { access_token, refresh_token };
  }

  @Patch('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: Express.User, @Res({ passthrough: true }) responses: Response) {
    await this.authService.SignOut(user['sub']);

    responses.cookie('session-access-token', '', {
      path: '/',
      maxAge: 0, // 0 menit
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    responses.cookie('session-refresh-token', '', {
      path: '/',
      maxAge: 0, // 0  hari
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return {
      code: HttpStatus.OK,
      status: 'OK',
    };
  }
}

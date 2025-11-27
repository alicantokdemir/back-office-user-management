import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiExtraModels,
  getSchemaPath,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { ResponseDto } from '../common/response.dto';
import { LoginResponseDto } from './dto/login.response.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto';
import { isMobile } from '../common/helper';
import { JwtAuth } from './auth.decorator';
import { ReqUser } from './auth.types';
import {
  ACCESS_TOKEN_COOKIE_AGE,
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_AGE,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../common/constants';

@ApiTags('auth')
@ApiExtraModels(ResponseDto, LoginResponseDto, RefreshTokenResponseDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Login a user',
    description: 'Logs in a user with the provided credentials.',
  })
  @ApiOkResponse({
    description: 'Login successful',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(LoginResponseDto) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid credentials or inactive user',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseDto<LoginResponseDto>> {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'] || '';

    const data = await this.authService.login(loginDto, ipAddress, userAgent);

    if (!isMobile(userAgent)) {
      this.saveTokensToCookie(
        {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
        res,
      );

      // Remove tokens from response body
      delete data.refreshToken;
      delete data.accessToken;
    }

    return new ResponseDto<LoginResponseDto>({
      data,
      message: 'Login successful',
      success: true,
    });
  }

  @ApiOperation({
    summary: 'Register a user',
    description: 'Registers a user with the provided credentials.',
  })
  @ApiOkResponse({
    description: 'Register successful',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: null,
          },
        },
      ],
    },
  })
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<ResponseDto> {
    await this.authService.register(registerDto);

    return new ResponseDto<LoginResponseDto>({
      message: 'Register successful',
      success: true,
    });
  }

  @ApiOperation({
    summary: 'Refresh token',
    description: 'Refreshes the JWT access token using a valid refresh token.',
  })
  @ApiOkResponse({
    description: 'Token refreshed successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(RefreshTokenResponseDto) },
          },
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token' })
  @Post('refresh')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseDto<RefreshTokenResponseDto>> {
    // Get refresh token from body (mobile) or cookie (web)
    const refreshToken = isMobile(req.headers['user-agent'] || '')
      ? refreshTokenDto.refreshToken
      : req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    const userAgent = req.headers['user-agent'] || '';

    const data = await this.authService.refreshAuth(refreshToken);

    if (!isMobile(userAgent)) {
      this.saveTokensToCookie(
        {
          accessToken: data.accessToken,
          refreshToken,
        },
        res,
      );

      // Remove token from response body
      delete data.accessToken;
    }

    return new ResponseDto<RefreshTokenResponseDto>({
      data,
      message: 'Token refreshed successfully',
      success: true,
    });
  }

  @ApiOperation({
    summary: 'Logout',
    description: 'Logs out a user by invalidating their session.',
  })
  @ApiOkResponse({
    description: 'Logout successful',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: { type: 'null' },
          },
        },
      ],
    },
  })
  @ApiBearerAuth('jwt-auth')
  @JwtAuth()
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Body() logoutDto: { refreshToken?: string; sessionId: string },
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseDto> {
    // Get refresh token from cookie or body
    const refreshToken = isMobile(req.headers['user-agent'] || '')
      ? logoutDto.refreshToken
      : req.cookies?.refreshToken;

    const reqUser = req.user as ReqUser;

    if (refreshToken) {
      await this.authService.logout(reqUser.sessionId, reqUser.userId);
      // Clear refresh token cookie
      res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
    }

    return new ResponseDto({
      message: 'Logout successful',
      success: true,
    });
  }

  private saveTokensToCookie({ accessToken, refreshToken }, res: Response) {
    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: ACCESS_TOKEN_COOKIE_AGE,
    });

    if (!refreshToken) {
      return;
    }

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: REFRESH_TOKEN_COOKIE_AGE,
    });
  }
}

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserDto } from '../users/users.dto';
import { UsersService } from '../users/users.service';
import {
  LoginDto,
  RegistrationDto,
  ResetPasswordDto,
  RestorePasswordDto,
  TokenReturnDto,
} from './auth.dto';
import { AccessTokenGuard, RegistrationGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('/login')
  getUsers(@Body() body: LoginDto): Promise<TokenReturnDto> {
    return this.authService.login(body);
  }

  @UseGuards(RegistrationGuard)
  @Post('/registration')
  getUserById(@Body() data: RegistrationDto): Promise<TokenReturnDto> {
    return this.authService.registration(data);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Get('/logout')
  logout(@Req() req) {
    return this.authService.logout(req.sub);
  }

  @Get('user')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  getUserByToken(@Req() req): Promise<UserDto> {
    return this.usersService.getUserById(req.sub);
  }

  @Post('reset-password')
  resetPassword(@Body() body: ResetPasswordDto): Promise<void> {
    return this.authService.resetPassword(body);
  }

  @Post('restore-password')
  restorePassword(@Body() body: RestorePasswordDto): Promise<void> {
    return this.authService.restorePassword(body);
  }

  @Get('screencasts')
  screencasts(): { id: number; url: string }[] {
    return [
      { id: 1, url: 'https://www.youtube.com/embed/YdMgw85la4s' },
      { id: 2, url: 'https://www.youtube.com/embed/T8ouqnIaLpM' },
      { id: 3, url: 'https://www.youtube.com/embed/OIk2H2DQFJ4' },
    ];
  }
}

import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import {
  LoginDto,
  RegistrationDto,
  ResetPasswordDto,
  RestorePasswordDto,
  TokenReturnDto,
} from './auth.dto';
import * as bcrypt from 'bcrypt';
import { Errors } from 'src/errors/auth';
import * as jwt from 'jsonwebtoken';
import { UserDto } from '../users/users.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async login({ login, password }: LoginDto): Promise<TokenReturnDto> {
    const user = await this.usersService.getUserByLogin(login);
    if (!user) {
      throw new UnauthorizedException({
        message: {
          incorrentInput: Errors.loginErrors.incorrentInput,
        },
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      const accessToken = await this.saveUserToken(user);
      return {
        accessToken,
      };
    }
    throw new UnauthorizedException({
      message: {
        incorrentInput: Errors.loginErrors.incorrentInput,
      },
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }

  async saveUserToken(user: UserDto) {
    const accessToken = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1314000s',
    });
    user.access_token = accessToken;
    await this.usersService.saveUser(user);
    return accessToken;
  }

  async registration(data: RegistrationDto): Promise<{ accessToken: string }> {
    const isExistsEmail = await this.usersService.getUserByEmail(data.email);
    const isExistsLogin = await this.usersService.getUserByLogin(data.login);
    console.log(isExistsEmail, 'exists');
    if (isExistsEmail) {
      throw new BadRequestException({
        message: { emailExists: Errors.registrationErrors.emailExists },
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (isExistsLogin) {
      throw new BadRequestException({
        message: { loginExists: Errors.registrationErrors.loginExists },
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(data.password, saltOrRounds);
    const user = await this.usersService.saveUser({ ...data, password: hash });
    const accessToken = await this.saveUserToken(user);
    return {
      accessToken,
    };
  }

  async validateAccessToken(token: string) {
    const tokenData = jwt.verify(
      token,
      process.env.JWT_SECRET,
    ) as jwt.JwtPayload;
    const user = await this.usersService.getUserById(tokenData.sub);
    return user;
  }

  async logout(userId: string): Promise<void> {
    const user = await this.usersService.getUserById(userId);
    this.usersService.saveUser({ ...user, access_token: null });
  }

  async resetPassword({ email, login }: ResetPasswordDto) {
    const fiveMinutes = new Date().getTime() + 5 * 60000;
    const user = email
      ? await this.usersService.getUserByEmail(email)
      : await this.usersService.getUserByLogin(login);
    if (!user) {
      throw new NotFoundException(Errors.authErrors.invalidEmail);
    }
    if (new Date().getTime() < parseInt(user.next_recovery_request_in)) {
      throw new NotFoundException(Errors.authErrors.userResetTokenIsNotReady);
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign({ code, sub: user.id }, process.env.JWT_SECRET, {
      expiresIn: '3600s',
    });
    await this.usersService.saveUser({
      ...user,
      recovery_code: code,
      next_recovery_request_in: `${fiveMinutes}`,
    });

    this.mailService.sendUserConfirmation(user, token);
  }

  async restorePassword(data: RestorePasswordDto): Promise<void> {
    const tokenData = jwt.verify(
      data.token,
      process.env.JWT_SECRET,
    ) as jwt.JwtPayload;
    const user = await this.usersService.getUserById(tokenData.sub);
    if (
      !user ||
      tokenData.code !== `${user.recovery_code}` ||
      tokenData.exp < (new Date().getTime() + 1) / 1000
    ) {
      throw new ForbiddenException(Errors.authErrors.invalidRestoreToken);
    }
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(data.newPassword, saltOrRounds);
    await this.usersService.saveUser({ ...user, password: hash });
  }
}

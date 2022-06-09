import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { isValidRegistrationInput, isValidRestoreInput } from './utils';
import * as jwt from 'jsonwebtoken';
import { Errors } from 'src/errors/auth';

@Injectable()
export class RegistrationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return isValidRegistrationInput(request.body);
  }
}

@Injectable()
export class AccessTokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = jwt.verify(
        request.headers.access_token,
        process.env.JWT_SECRET,
      ) as jwt.JwtPayload;

      if (token.exp < (new Date().getTime() + 1) / 1000) {
        throw new UnauthorizedException(Errors.authErrors.invalidToken);
      }
      request.sub = token.sub;
      return true;
    } catch (e) {
      throw new UnauthorizedException(Errors.authErrors.invalidToken);
    }
  }
}

@Injectable()
export class RestorePasswordGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return isValidRestoreInput(request.body);
  }
}

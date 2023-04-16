import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ChangeUserDataGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.body.name) {
      throw new BadRequestException({ message: 'Name is required' });
    }
    if (!request.body.email) {
      throw new BadRequestException({ message: 'Email is required' });
    }
    if (!request.body.login) {
      throw new BadRequestException({ message: 'Login is required' });
    }
    return true;
  }
}

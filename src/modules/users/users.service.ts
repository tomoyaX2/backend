import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { keys, omit } from 'src/shared/utils';
import { FindOperator, Like, Repository } from 'typeorm';
import { ChangeUserDataDto, PaginatedUsersDto, UserDto } from './users.dto';
import { User } from './users.entity';
import { FileService } from '../file/file.service';
import { RateDto } from '../manga/rate/rate.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<UserDto>,
    private fileService: FileService,
  ) {}

  async getUsers({ page, perPage, name, email }): Promise<PaginatedUsersDto> {
    const where = {} as Record<string, FindOperator<string>>;
    name && (where.name = Like('%' + name + '%'));
    email && (where.email = Like('%' + email + '%'));
    const [data, total] = await this.usersRepository.findAndCount({
      where,
      take: perPage,
      skip: page * perPage,
      order: { created_date: 'DESC' },
    });
    return { data, total, currentPage: page };
  }

  async getUserById(id: string, relations?: string[]): Promise<UserDto> {
    const data = await this.usersRepository.findOne(
      {
        id,
      },
      { relations },
    );
    return omit<UserDto>(data, ['password']);
  }

  async getUserByLogin(login: string): Promise<UserDto> {
    const data = await this.usersRepository.findOne({ login });
    return data;
  }

  async getUserByEmail(email: string): Promise<UserDto> {
    const data = await this.usersRepository.findOne({ email });
    return omit<UserDto>(data, ['password', 'isAdmin']);
  }

  async saveUser(user: UserDto): Promise<UserDto> {
    return this.usersRepository.save(user);
  }

  async changeAdminStatus({
    id,
    status,
  }: {
    id: string;
    status: boolean;
  }): Promise<void> {
    const user = await this.usersRepository.findOne({
      id,
    });
    user.isAdmin = status;
    await this.usersRepository.save(user);
  }

  deleteUsers = async ({ userIds }: { userIds: string[] }) => {
    try {
      await this.usersRepository.delete(userIds);
    } catch (e) {
      console.error(e);
    }
  };

  saveUserAvatar = async ({
    imageData,
    userId,
  }: {
    imageData: Buffer;
    userId: string;
  }) => {
    const { imageUrl } = await this.fileService.uploadUserAvatarImage({
      imageData,
      userId,
    });
    const user = await this.usersRepository.findOne({
      id: userId,
    });
    user.avatarUrl = `${process.env.CDN_URL}/${imageUrl}`;
    await this.usersRepository.save(user);
  };

  updateUserProfileData = async ({
    userData,
    userId,
  }: {
    userData: ChangeUserDataDto;
    userId: string;
  }) => {
    const user = await this.usersRepository.findOne({
      id: userId,
    });
    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }
    if (userData.email !== user.email) {
      const record = await this.getUserByEmail(userData.email);
      if (record) {
        throw new BadRequestException({ message: 'Email is already taken' });
      }
    }
    if (userData.login !== user.login) {
      const record = await this.getUserByLogin(userData.login);
      if (record) {
        throw new BadRequestException({ message: 'Login is already taken' });
      }
    }
    for (const userFieldToUpdate of keys(userData)) {
      user[userFieldToUpdate] = userData[userFieldToUpdate];
    }
    await this.usersRepository.save(user);
    return '';
  };

  assignRateToUser = async ({
    rate,
    userId,
  }: {
    rate: RateDto;
    userId: string;
  }) => {
    const user = await this.getUserById(userId);
    user.rates = [...user.rates, rate];
    this.usersRepository.save(user);
    return user;
  };
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { omit } from 'src/shared/utils';
import { FindOperator, Like, Repository } from 'typeorm';
import { PaginatedUsersDto, UserDto } from './users.dto';
import { User } from './users.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<UserDto>,
  ) {}

  async getUsers({ page, perPage, name, email }): Promise<PaginatedUsersDto> {
    const where = {} as Record<string, FindOperator<string>>;
    name && (where.name = Like('%' + name + '%'));
    email && (where.email = Like('%' + email + '%'));
    const [data, total] = await this.usersRepository.findAndCount({
      where,
      take: perPage,
      skip: page * perPage,
    });
    return { data, total, currentPage: page };
  }

  async getUserById(id: string): Promise<UserDto> {
    const data = await this.usersRepository.findOne(
      {
        id,
      },
      { relations: ['comments'] },
    );
    return omit<UserDto>(data, ['password']);
  }

  async getUserByLogin(login: string): Promise<UserDto> {
    const data = await this.usersRepository.findOne({ login });
    return data;
  }

  async getUserByEmail(email: string): Promise<UserDto> {
    const data = await this.usersRepository.findOne({ email });
    return data;
  }

  async saveUser(user: UserDto): Promise<UserDto> {
    return this.usersRepository.save(user);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumDto, RateDto } from '../album/album.dto';
import { Rate } from './rate.entity';
import { UserDto } from '../users/users.dto';

@Injectable()
export class RateService {
  constructor(
    @InjectRepository(Rate)
    private rateRepository: Repository<RateDto>,
  ) {}
  saveRate = async ({
    user,
    album,
    rate,
  }: {
    user: UserDto;
    album: AlbumDto;
    rate: number;
  }) => {
    const result = await this.rateRepository.findOne({
      where: {
        user: { id: user.id },
        album: { id: album.id },
      },
      relations: ['album', 'user'],
    });
    if (result) {
      result.rate = rate;
      return await this.rateRepository.save(result);
    }
    return await this.rateRepository.save({ rate, user, album });
  };

  getRate = async ({ user, album }: { user: UserDto; album: AlbumDto }) => {
    const result = await this.rateRepository.findOne({
      where: {
        user: { id: user.id },
        album: { id: album.id },
      },
    });
    return result ? result : { rate: 0 };
  };
}

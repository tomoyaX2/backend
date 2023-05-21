import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rate } from './rate.entity';
import { UserDto } from '../../users/users.dto';
import { VideoDto, RateDto } from '../video/video.dto';

@Injectable()
export class RateService {
  constructor(
    @InjectRepository(Rate)
    private rateRepository: Repository<RateDto>,
  ) {}
  saveRate = async ({
    user,
    video,
    rate,
  }: {
    user: UserDto;
    video: VideoDto;
    rate: number;
  }) => {
    const result = await this.rateRepository.findOne({
      where: {
        user: { id: user.id },
        video: { id: video.id },
      },
      relations: ['video', 'user'],
    });
    if (result) {
      result.rate = rate;
      return await this.rateRepository.save(result);
    }
    return await this.rateRepository.save({ rate, user, video });
  };

  getRate = async ({ user, video }: { user: UserDto; video: VideoDto }) => {
    const result = await this.rateRepository.findOne({
      where: {
        user: { id: user.id },
        video: { id: video.id },
      },
    });
    return result ? result : { rate: 0 };
  };
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/users.entity';
import { Video } from '../video/video.entity';

@Entity('video-rate')
export class Rate {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column()
  rate: number;

  @ManyToOne(() => Video, (video) => video.rates, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn()
  video: Video;

  @ManyToOne(() => User, (user) => user.rates)
  @JoinColumn()
  user: User;
}

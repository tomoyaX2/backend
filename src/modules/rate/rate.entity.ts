import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Album } from '../album/album.entity';

@Entity()
export class Rate {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column()
  rate: number;

  @ManyToOne(() => Album, (album) => album.rates)
  @JoinColumn()
  album: Album;

  @ManyToOne(() => User, (user) => user.rates)
  @JoinColumn()
  user: User;
}

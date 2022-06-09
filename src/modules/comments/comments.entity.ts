import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Album } from '../album/album.entity';
import { User } from '../users/users.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ length: 1500 })
  text: string;

  @ManyToOne(() => Album, (album) => album.comments)
  album: Album;

  @ManyToOne(() => User, (album) => album.comments)
  author: User;
}

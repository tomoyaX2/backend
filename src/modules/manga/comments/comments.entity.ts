import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Album } from '../album/album.entity';
import { User } from 'src/modules/users/users.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ length: 1500 })
  text: string;

  @ManyToOne(() => Album, (album) => album.comments, {
    onDelete: 'CASCADE',
  })
  album: Album;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  author: User;

  @CreateDateColumn()
  created_date?: Date;

  @UpdateDateColumn()
  updated_date?: Date;
}

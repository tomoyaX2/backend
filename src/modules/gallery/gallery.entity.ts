import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Album } from '../album/album.entity';
import { User } from '../users/users.entity';

@Entity()
export class Gallery {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column()
  name: string;

  @OneToMany(() => Album, (album) => album.gallery)
  albums?: Album[];

  @ManyToOne(() => User, (user) => user.galleries)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: User;
}

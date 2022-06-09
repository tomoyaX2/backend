import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Album } from '../album/album.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  url?: string;

  @ManyToOne(() => Album, (album) => album.images)
  @JoinColumn({ name: 'album_id', referencedColumnName: 'id' })
  album?: Album;
}

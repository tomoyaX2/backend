import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Album } from '../album/album.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  url?: string;

  @Column({ nullable: true })
  width?: number;

  @Column({ nullable: true })
  height?: number;

  @Index()
  @ManyToOne(() => Album, (album) => album.images, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'album_id', referencedColumnName: 'id' })
  album?: Album;
}

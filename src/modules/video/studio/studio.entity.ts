import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Video } from '../video/video.entity';

@Entity('video-studio')
export class Studio {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Video, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'studio_video',
    joinColumn: {
      name: 'studio_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'video_id',
      referencedColumnName: 'id',
    },
  })
  videos?: Studio[];
}

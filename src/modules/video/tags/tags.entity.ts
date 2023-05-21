import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Video } from '../video/video.entity';

@Entity('video-tag')
export class Tag {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  videosCount: number;

  @ManyToMany(() => Video)
  @JoinTable({
    name: 'tag_videos',
    joinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'video_id',
      referencedColumnName: 'id',
    },
  })
  videos?: Video[];
}

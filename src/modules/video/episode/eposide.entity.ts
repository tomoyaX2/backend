import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Video } from '../video/video.entity';
import { Quality } from '../quality/quality.entity';

@Entity()
export class Episode {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column()
  name: string;

  @Column()
  url: string;

  @ManyToOne(() => Video, (video) => video.episodes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  video?: Video;

  @ManyToMany(() => Quality, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinTable({
    name: 'episode_quality',
    joinColumn: {
      name: 'episode_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'quality_id',
      referencedColumnName: 'id',
    },
  })
  qualities?: Quality[];
}

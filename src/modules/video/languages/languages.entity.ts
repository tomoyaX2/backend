import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Video } from '../video/video.entity';

@Entity('video-language')
export class Language {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Video, (video) => video.language)
  videos?: Video[];
}

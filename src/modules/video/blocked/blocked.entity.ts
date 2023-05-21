import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('video-blocked')
export class BlockedVideo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  link: string;
}

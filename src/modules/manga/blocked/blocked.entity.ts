import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BlockedAlbum {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  link: string;
}

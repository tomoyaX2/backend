import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Album } from '../album/album.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Album, (album) => album.group)
  albums?: Album[];
}

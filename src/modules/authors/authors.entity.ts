import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Album } from '../album/album.entity';

@Entity()
export class Author {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Album, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinTable({
    name: 'author_albums',
    joinColumn: {
      name: 'author_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'album_id',
      referencedColumnName: 'id',
    },
  })
  albums: Album[];
}

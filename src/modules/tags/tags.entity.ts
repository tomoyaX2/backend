import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Album } from '../album/album.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Album, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinTable({
    name: 'tag_albums',
    joinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'album_id',
      referencedColumnName: 'id',
    },
  })
  albums?: Album[];
}

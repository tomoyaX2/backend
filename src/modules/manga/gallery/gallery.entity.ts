import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { Album } from '../album/album.entity';
import { User } from '../../users/users.entity';

@Entity()
export class Gallery {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  maxAmount: number;

  @ManyToMany(() => Album, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinTable({
    name: 'gallery_album',
    joinColumn: {
      name: 'gallery_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'album_id',
      referencedColumnName: 'id',
    },
  })
  albums?: Album[];

  @ManyToOne(() => User, (user) => user.galleries, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: User;
}

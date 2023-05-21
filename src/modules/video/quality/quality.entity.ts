import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Episode } from '../episode/eposide.entity';

@Entity()
export class Quality {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Episode, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinTable({
    name: 'quality_episode',
    joinColumn: {
      name: 'quality_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'episode_id',
      referencedColumnName: 'id',
    },
  })
  episodes: Episode[];
}

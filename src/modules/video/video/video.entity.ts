import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from '../comments/comments.entity';
import { Language } from '../languages/languages.entity';
import { Tag } from '../tags/tags.entity';
import { Type } from '../type/type.entity';
import { Rate } from '../rate/rate.entity';
import { Episode } from '../episode/eposide.entity';
import { Studio } from '../studio/studio.entity';

@Entity()
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  originalTitle?: string;

  @Column({ nullable: true })
  views?: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  releaseDate?: Date;

  @OneToMany(() => Rate, (rate) => rate.video, {
    onDelete: 'CASCADE',
  })
  rates: Rate[];

  get rate(): number {
    const result =
      this.rates?.reduce((acc, curr) => acc + curr.rate, 0) /
        this.rates?.length || 0;

    return result;
  }

  @Column({ nullable: true })
  coverImageUrl?: string;

  @OneToMany(() => Episode, (episode) => episode.video, {
    onDelete: 'CASCADE',
  })
  episodes?: Episode[];

  @OneToMany(() => Comment, (comment) => comment.video, {
    onDelete: 'CASCADE',
  })
  comments?: Comment[];

  @ManyToOne(() => Type, (type) => type.videos, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'type_id', referencedColumnName: 'id' })
  type?: Type;

  @ManyToOne(() => Language, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'language_id', referencedColumnName: 'id' })
  language?: Language;

  @ManyToMany(() => Studio, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'video_studio',
    joinColumn: {
      name: 'video_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'studio_id',
      referencedColumnName: 'id',
    },
  })
  studios?: Studio[];

  @ManyToMany(() => Tag, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'video_tags',
    joinColumn: {
      name: 'video_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags?: Tag[];

  @CreateDateColumn()
  created_date?: Date;

  @UpdateDateColumn()
  updated_date?: Date;
}

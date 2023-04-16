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
import { Author } from '../authors/authors.entity';
import { Comment } from '../comments/comments.entity';
import { Gallery } from '../gallery/gallery.entity';
import { Group } from '../group/group.entity';
import { Image } from '../image/image.entity';
import { Language } from '../languages/languages.entity';
import { Series } from '../series/series.entity';
import { Tag } from '../tags/tags.entity';
import { Type } from '../type/type.entity';

@Entity()
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  views?: number;

  @Column({ nullable: true })
  rate?: number;

  @Column({ nullable: true })
  totalImages?: number;

  @ManyToOne(() => Gallery, (gallery) => gallery.albums, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'gallery_id',
    referencedColumnName: 'id',
  })
  gallery?: Gallery;

  @Column({ nullable: true })
  path?: string;

  @Column({ nullable: true })
  downloadPath?: string;

  @OneToMany(() => Image, (image) => image.album)
  images?: Image[];

  @Column({ nullable: true })
  preview?: string;

  @Column({ nullable: true })
  previewOrientation?: 'horizontal' | 'vertical';

  @OneToMany(() => Comment, (comment) => comment.album, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  comments?: Comment[];

  @ManyToMany(() => Author, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinTable({
    name: 'album_authors',
    joinColumn: {
      name: 'album_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'author_id',
      referencedColumnName: 'id',
    },
  })
  authors?: Author[];

  @ManyToOne(() => Type, (type) => type.albums, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'type_id', referencedColumnName: 'id' })
  type?: Type;

  @ManyToOne(() => Series, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'series_id', referencedColumnName: 'id' })
  series?: Series;

  @ManyToOne(() => Language, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'language_id', referencedColumnName: 'id' })
  language?: Language;

  @ManyToOne(() => Group, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
  group?: Group;

  @ManyToMany(() => Tag, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinTable({
    name: 'album_tags',
    joinColumn: {
      name: 'album_id',
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

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

  @Column()
  totalImages?: number;

  @ManyToOne(() => Gallery, (gallery) => gallery.albums)
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

  @ManyToOne(() => Type, (type) => type.albums)
  @JoinColumn({ name: 'type_id', referencedColumnName: 'id' })
  type?: Type;

  @ManyToOne(() => Series)
  @JoinColumn({ name: 'series_id', referencedColumnName: 'id' })
  series?: Series;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id', referencedColumnName: 'id' })
  language?: Language;

  @ManyToOne(() => Group)
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
  createdDate?: Date;

  @UpdateDateColumn()
  updatedDate?: Date;
}

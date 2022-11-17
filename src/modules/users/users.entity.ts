import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Comment } from '../comments/comments.entity';
import { Gallery } from '../gallery/gallery.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ unique: true, length: 255 })
  login: string;

  @Column({ unique: true, length: 255, nullable: true })
  email?: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  twoFaEnabled: boolean;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  isAdmin: boolean;

  @Column({ nullable: true })
  recovery_code: string;

  @Column({ nullable: true, select: false })
  next_recovery_request_in?: string;

  @Column({ nullable: true, select: false })
  access_token: string;

  @Column({ nullable: true, select: false })
  two_factor_code: string;

  @Column({ nullable: true, length: 255 })
  phone: string;

  @OneToMany(() => Gallery, (gallery) => gallery.user)
  galleries: Gallery[];

  @OneToMany(() => Comment, (comment) => comment.author, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  comments: Comment[];
}

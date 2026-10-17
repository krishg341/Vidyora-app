import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Chapter } from './chapter.entity';

/** One row per student + chapter. `completed` is false while a lesson is only unmarked again. */
@Entity('progress')
@Unique(['studentId', 'chapterId'])
export class Progress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'student_id' })
  studentId: string;

  @Column({ name: 'chapter_id' })
  chapterId: string;

  @ManyToOne(() => Chapter, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chapter_id' })
  chapter: Chapter;

  @Column({ default: true })
  completed: boolean;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

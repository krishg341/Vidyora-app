import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { SchoolClass } from './school-class.entity';
import { Subject } from './subject.entity';

@Entity('chapters')
export class Chapter {
  @ApiProperty({ example: 'class-6-english-maths-1', description: 'Chapter identifier' })
  @PrimaryColumn()
  id: string;

  @ApiProperty({ example: 'class-6' })
  @Column({ name: 'class_id' })
  classId: string;

  @ApiProperty({ type: () => SchoolClass })
  @ManyToOne(() => SchoolClass, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  schoolClass: SchoolClass;

  @ApiProperty({ example: 'maths' })
  @Column({ name: 'subject_id' })
  subjectId: string;

  @ApiProperty({ type: () => Subject })
  @ManyToOne(() => Subject, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @ApiProperty({ example: 'English' })
  @Column()
  medium: string;

  @ApiProperty({ example: 1, description: 'Chapter number inside the subject' })
  @Column()
  number: number;

  @ApiProperty({ example: 'Knowing Our Numbers' })
  @Column()
  title: string;

  @ApiProperty({ example: '15 min' })
  @Column()
  duration: string;

  @ApiProperty({ example: 'In this lesson, you will build an understanding of Knowing Our Numbers through simple explanations and examples.' })
  @Column('text')
  overview: string;

  @ApiProperty({ type: [String], example: ['Understand the main idea of Knowing Our Numbers.'] })
  @Column('jsonb')
  points: string[];

  @ApiProperty({ type: [String], example: ['What is one important idea you learned in this chapter?'] })
  @Column('jsonb')
  questions: string[];
}

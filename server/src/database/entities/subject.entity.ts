import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('subjects')
export class Subject {
  @ApiProperty({ example: 'maths' })
  @PrimaryColumn()
  id: string;

  @ApiProperty({ example: 'Mathematics' })
  @Column()
  title: string;

  @ApiProperty({ example: 'Numbers, patterns and problem-solving' })
  @Column()
  subtitle: string;

  @ApiProperty({ example: '∑', description: 'Icon shown in the app' })
  @Column()
  icon: string;

  @ApiProperty({ example: '#E9E8FF', description: 'Background colour used in the app' })
  @Column()
  tint: string;

  @ApiProperty({ example: 1, description: 'Display order' })
  @Column()
  position: number;
}

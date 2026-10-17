import { ApiProperty } from '@nestjs/swagger';

export class ClassSubjectDto {
  @ApiProperty({ example: 'maths' })
  id: string;

  @ApiProperty({ example: 'Mathematics' })
  title: string;

  @ApiProperty({ example: 'Numbers, patterns and problem-solving' })
  subtitle: string;

  @ApiProperty({ example: '∑', description: 'Icon shown in the app' })
  icon: string;

  @ApiProperty({ example: '#E9E8FF', description: 'Background colour used in the app' })
  tint: string;

  @ApiProperty({ example: 4, description: 'Number of chapters of this subject in the class' })
  chapterCount: number;
}

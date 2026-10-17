import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateProgressDto {
  @ApiProperty({
    example: true,
    description: 'true marks the chapter as completed, false clears the completion',
  })
  @IsBoolean()
  completed: boolean;
}

export class ProgressSummaryDto {
  @ApiProperty({ example: 'demo-student' })
  studentId: string;

  @ApiProperty({
    example: 'class-6',
    required: false,
    description: 'Present when the summary was scoped to a single class',
  })
  classId?: string;

  @ApiProperty({ type: [String], example: ['class-6-english-maths-1'] })
  completedChapterIds: string[];

  @ApiProperty({ example: 1 })
  completedCount: number;

  @ApiProperty({ example: 20 })
  totalChapters: number;

  @ApiProperty({ example: 5 })
  percent: number;
}

export class ProgressUpdateDto {
  @ApiProperty({ example: 'demo-student' })
  studentId: string;

  @ApiProperty({ example: 'class-6-english-maths-1' })
  chapterId: string;

  @ApiProperty({ example: true })
  completed: boolean;
}

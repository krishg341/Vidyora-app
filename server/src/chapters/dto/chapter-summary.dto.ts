import { ApiProperty } from '@nestjs/swagger';

export class ChapterSummaryDto {
  @ApiProperty({ example: 'class-6-english-maths-1', description: 'Chapter identifier' })
  id: string;

  @ApiProperty({ example: 'class-6' })
  classId: string;

  @ApiProperty({ example: 'maths' })
  subjectId: string;

  @ApiProperty({ example: 'English' })
  medium: string;

  @ApiProperty({ example: 1, description: 'Chapter number inside the subject' })
  number: number;

  @ApiProperty({ example: 'Knowing Our Numbers' })
  title: string;

  @ApiProperty({ example: '15 min' })
  duration: string;
}

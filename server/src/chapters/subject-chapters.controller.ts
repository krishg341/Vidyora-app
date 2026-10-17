import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { ChapterSummaryDto } from './dto/chapter-summary.dto';
import { ChaptersService } from './chapters.service';

@ApiTags('chapters')
@Controller('classes/:classId/subjects/:subjectId/chapters')
export class SubjectChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Get()
  @ApiOperation({ summary: 'List the chapters of a subject in a class' })
  @ApiParam({ name: 'classId', example: 'class-6' })
  @ApiParam({ name: 'subjectId', example: 'maths' })
  @ApiOkResponse({ type: ChapterSummaryDto, isArray: true })
  @ApiNotFoundResponse({ description: 'Class or subject not found' })
  findByClassAndSubject(@Param('classId') classId: string, @Param('subjectId') subjectId: string) {
    return this.chaptersService.findByClassAndSubject(classId, subjectId);
  }
}

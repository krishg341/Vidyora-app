import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ProgressSummaryDto, ProgressUpdateDto, UpdateProgressDto } from './dto/progress.dto';
import { ProgressService } from './progress.service';

@ApiTags('progress')
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get(':studentId')
  @ApiOperation({ summary: 'Get the learning progress of a student, optionally scoped to one class' })
  @ApiParam({ name: 'studentId', example: 'demo-student' })
  @ApiQuery({ name: 'classId', required: false, example: 'class-6' })
  @ApiOkResponse({ type: ProgressSummaryDto })
  summary(@Param('studentId') studentId: string, @Query('classId') classId?: string) {
    return this.progressService.summary(studentId, classId);
  }

  @Put(':studentId/chapters/:chapterId')
  @ApiOperation({ summary: 'Mark a chapter as completed (or clear the completion) for a student' })
  @ApiParam({ name: 'studentId', example: 'demo-student' })
  @ApiParam({ name: 'chapterId', example: 'class-6-english-maths-1' })
  @ApiOkResponse({ type: ProgressUpdateDto })
  @ApiNotFoundResponse({ description: 'Chapter not found' })
  setCompleted(
    @Param('studentId') studentId: string,
    @Param('chapterId') chapterId: string,
    @Body() body: UpdateProgressDto,
  ) {
    return this.progressService.setCompleted(studentId, chapterId, body.completed);
  }
}

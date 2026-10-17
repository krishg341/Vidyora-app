import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { Chapter } from '../database/entities/chapter.entity';
import { ChaptersService } from './chapters.service';

@ApiTags('chapters')
@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Get(':chapterId')
  @ApiOperation({ summary: 'Get a chapter with its full lesson content' })
  @ApiParam({ name: 'chapterId', example: 'class-6-english-maths-1' })
  @ApiOkResponse({ type: Chapter })
  @ApiNotFoundResponse({ description: 'Chapter not found' })
  findOne(@Param('chapterId') chapterId: string) {
    return this.chaptersService.findOne(chapterId);
  }
}

import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { SchoolClass } from '../database/entities/school-class.entity';
import { ClassSubjectDto } from './dto/class-subject.dto';
import { ClassesService } from './classes.service';

@ApiTags('classes')
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  @ApiOperation({ summary: 'List all classes (Class 6 - Class 10)' })
  @ApiOkResponse({ type: SchoolClass, isArray: true })
  findAll() {
    return this.classesService.findAll();
  }

  @Get(':classId')
  @ApiOperation({ summary: 'Get a single class' })
  @ApiParam({ name: 'classId', example: 'class-6' })
  @ApiOkResponse({ type: SchoolClass })
  @ApiNotFoundResponse({ description: 'Class not found' })
  findOne(@Param('classId') classId: string) {
    return this.classesService.findOne(classId);
  }

  @Get(':classId/subjects')
  @ApiOperation({ summary: 'List the subjects of a class, each with its chapter count' })
  @ApiParam({ name: 'classId', example: 'class-6' })
  @ApiOkResponse({ type: ClassSubjectDto, isArray: true })
  @ApiNotFoundResponse({ description: 'Class not found' })
  findSubjects(@Param('classId') classId: string) {
    return this.classesService.findSubjects(classId);
  }
}

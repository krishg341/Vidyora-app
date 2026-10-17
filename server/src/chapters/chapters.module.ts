import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from '../database/entities/chapter.entity';
import { SchoolClass } from '../database/entities/school-class.entity';
import { Subject } from '../database/entities/subject.entity';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
import { SubjectChaptersController } from './subject-chapters.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Chapter, SchoolClass, Subject])],
  controllers: [ChaptersController, SubjectChaptersController],
  providers: [ChaptersService],
})
export class ChaptersModule {}

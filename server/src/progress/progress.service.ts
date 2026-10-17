import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Chapter } from '../database/entities/chapter.entity';
import { SchoolClass } from '../database/entities/school-class.entity';
import { Progress } from '../database/entities/progress.entity';
import { ProgressSummaryDto, ProgressUpdateDto } from './dto/progress.dto';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress) private readonly progress: Repository<Progress>,
    @InjectRepository(Chapter) private readonly chapters: Repository<Chapter>,
    @InjectRepository(SchoolClass) private readonly classes: Repository<SchoolClass>,
  ) {}

  async summary(studentId: string, classId?: string): Promise<ProgressSummaryDto> {
    let chapterIds: string[] | undefined;
    if (classId) {
      const classExists = await this.classes.existsBy({ id: classId });
      if (!classExists) {
        throw new NotFoundException(`Class '${classId}' was not found`);
      }
      chapterIds = (await this.chapters.findBy({ classId })).map((chapter) => chapter.id);
    }

    const rows = await this.progress.find({
      where: {
        studentId,
        completed: true,
        ...(chapterIds ? { chapterId: In(chapterIds) } : {}),
      },
    });

    const completedChapterIds = rows.map((row) => row.chapterId).sort();
    const totalChapters = chapterIds ? chapterIds.length : await this.chapters.count();
    const percent = totalChapters === 0 ? 0 : Math.round((completedChapterIds.length / totalChapters) * 100);

    return {
      studentId,
      ...(classId ? { classId } : {}),
      completedChapterIds,
      completedCount: completedChapterIds.length,
      totalChapters,
      percent,
    };
  }

  async setCompleted(studentId: string, chapterId: string, completed: boolean): Promise<ProgressUpdateDto> {
    const chapter = await this.chapters.findOneBy({ id: chapterId });
    if (!chapter) {
      throw new NotFoundException(`Chapter '${chapterId}' was not found`);
    }

    const existing = await this.progress.findOneBy({ studentId, chapterId });
    if (existing) {
      existing.completed = completed;
      await this.progress.save(existing);
    } else {
      await this.progress.save({ studentId, chapterId, completed });
    }

    return { studentId, chapterId, completed };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chapter } from '../database/entities/chapter.entity';
import { SchoolClass } from '../database/entities/school-class.entity';
import { Subject } from '../database/entities/subject.entity';
import { ChapterSummaryDto } from './dto/chapter-summary.dto';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(Chapter) private readonly chapters: Repository<Chapter>,
    @InjectRepository(SchoolClass) private readonly classes: Repository<SchoolClass>,
    @InjectRepository(Subject) private readonly subjects: Repository<Subject>,
  ) {}

  async findByClassAndSubject(classId: string, subjectId: string): Promise<ChapterSummaryDto[]> {
    await this.ensureClassAndSubjectExist(classId, subjectId);

    const chapters = await this.chapters.find({
      where: { classId, subjectId },
      order: { number: 'ASC' },
    });
    return chapters.map((chapter) => ({
      id: chapter.id,
      classId: chapter.classId,
      subjectId: chapter.subjectId,
      medium: chapter.medium,
      number: chapter.number,
      title: chapter.title,
      duration: chapter.duration,
    }));
  }

  async findOne(id: string): Promise<Chapter> {
    const chapter = await this.chapters.findOne({
      where: { id },
      relations: { schoolClass: true, subject: true },
    });
    if (!chapter) {
      throw new NotFoundException(`Chapter '${id}' was not found`);
    }
    return chapter;
  }

  private async ensureClassAndSubjectExist(classId: string, subjectId: string) {
    const classExists = await this.classes.existsBy({ id: classId });
    if (!classExists) {
      throw new NotFoundException(`Class '${classId}' was not found`);
    }
    const subjectExists = await this.subjects.existsBy({ id: subjectId });
    if (!subjectExists) {
      throw new NotFoundException(`Subject '${subjectId}' was not found`);
    }
  }
}

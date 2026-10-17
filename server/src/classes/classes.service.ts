import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chapter } from '../database/entities/chapter.entity';
import { SchoolClass } from '../database/entities/school-class.entity';
import { Subject } from '../database/entities/subject.entity';
import { ClassSubjectDto } from './dto/class-subject.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(SchoolClass) private readonly classes: Repository<SchoolClass>,
    @InjectRepository(Subject) private readonly subjects: Repository<Subject>,
    @InjectRepository(Chapter) private readonly chapters: Repository<Chapter>,
  ) {}

  findAll(): Promise<SchoolClass[]> {
    return this.classes.find({ order: { number: 'ASC' } });
  }

  async findOne(classId: string): Promise<SchoolClass> {
    const schoolClass = await this.classes.findOneBy({ id: classId });
    if (!schoolClass) {
      throw new NotFoundException(`Class '${classId}' was not found`);
    }
    return schoolClass;
  }

  async findSubjects(classId: string): Promise<ClassSubjectDto[]> {
    await this.findOne(classId); // 404 for an unknown class

    const subjects = await this.subjects.find({ order: { position: 'ASC' } });
    const result: ClassSubjectDto[] = [];
    for (const subject of subjects) {
      const chapterCount = await this.chapters.countBy({ classId, subjectId: subject.id });
      result.push({
        id: subject.id,
        title: subject.title,
        subtitle: subject.subtitle,
        icon: subject.icon,
        tint: subject.tint,
        chapterCount,
      });
    }
    return result;
  }
}

import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { buildSeed } from './seed-data';
import { Chapter } from './entities/chapter.entity';
import { SchoolClass } from './entities/school-class.entity';
import { Subject } from './entities/subject.entity';

/** Seeds the Class 6-10 curriculum into PostgreSQL on first boot (skips when data already exists). */
@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(SchoolClass) private readonly classes: Repository<SchoolClass>,
    @InjectRepository(Subject) private readonly subjects: Repository<Subject>,
    @InjectRepository(Chapter) private readonly chapters: Repository<Chapter>,
  ) {}

  async onApplicationBootstrap() {
    const existing = await this.classes.count();
    if (existing > 0) {
      this.logger.log(`Curriculum already seeded (${existing} classes) - skipping`);
      return;
    }

    const seed = buildSeed();
    const savedClasses = await this.classes.save(seed.classes);
    const savedSubjects = await this.subjects.save(seed.subjects);

    const classById = new Map(savedClasses.map((schoolClass) => [schoolClass.id, schoolClass]));
    const subjectById = new Map(savedSubjects.map((subject) => [subject.id, subject]));
    await this.chapters.save(
      seed.chapters.map((chapter) => ({
        ...chapter,
        schoolClass: classById.get(chapter.classId),
        subject: subjectById.get(chapter.subjectId),
      })),
    );

    this.logger.log(`Seeded ${savedClasses.length} classes, ${savedSubjects.length} subjects, ${seed.chapters.length} chapters`);
  }
}

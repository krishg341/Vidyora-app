import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from './entities/chapter.entity';
import { SchoolClass } from './entities/school-class.entity';
import { Subject } from './entities/subject.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([SchoolClass, Subject, Chapter])],
  providers: [SeedService],
})
export class SeedModule {}

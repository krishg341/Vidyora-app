import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from '../database/entities/chapter.entity';
import { SchoolClass } from '../database/entities/school-class.entity';
import { Subject } from '../database/entities/subject.entity';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';

@Module({
  imports: [TypeOrmModule.forFeature([SchoolClass, Subject, Chapter])],
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}

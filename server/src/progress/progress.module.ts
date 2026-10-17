import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from '../database/entities/chapter.entity';
import { SchoolClass } from '../database/entities/school-class.entity';
import { Progress } from '../database/entities/progress.entity';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';

@Module({
  imports: [TypeOrmModule.forFeature([Progress, Chapter, SchoolClass])],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}

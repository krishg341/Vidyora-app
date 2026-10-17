import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ClassesModule } from './classes/classes.module';
import { ChaptersModule } from './chapters/chapters.module';
import { SeedModule } from './database/seed.module';
import { HealthModule } from './health/health.module';
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5433),
      username: process.env.DB_USER ?? 'vidyora',
      password: process.env.DB_PASSWORD ?? 'vidyora',
      database: process.env.DB_NAME ?? 'vidyora',
      autoLoadEntities: true,
      // Creates/updates tables automatically - convenient for development.
      // Replace with migrations before running this in production.
      synchronize: true,
    }),
    SeedModule,
    ClassesModule,
    ChaptersModule,
    ProgressModule,
    HealthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

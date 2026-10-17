import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('classes')
export class SchoolClass {
  @ApiProperty({ example: 'class-6', description: 'Class identifier' })
  @PrimaryColumn()
  id: string;

  @ApiProperty({ example: 'Class 6' })
  @Column()
  name: string;

  @ApiProperty({ example: 6, description: 'Class number (6-10)' })
  @Column()
  number: number;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLessonGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

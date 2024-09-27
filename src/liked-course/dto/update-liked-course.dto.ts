import { PartialType } from '@nestjs/mapped-types';
import { CreateLikedCourseDto } from './create-liked-course.dto';

export class UpdateLikedCourseDto extends PartialType(CreateLikedCourseDto) {}

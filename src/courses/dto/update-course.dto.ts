import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
    name?: string;
    description?: string;
    price?: number;
    categoryId?: number;  // Optional for updating the category
    isSelled?: boolean;
    banner?: string;  // Optional for updating the banner image URL
}

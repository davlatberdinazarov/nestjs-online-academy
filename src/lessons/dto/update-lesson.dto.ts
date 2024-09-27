import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonDto } from './create-lesson.dto';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UpdateLessonDto extends PartialType(CreateLessonDto) {
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsString()
    @IsNotEmpty()
    description?: string;

    @IsString()
    @IsNotEmpty()
    videoUrl?: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{1,2}:\d{2}(:\d{2})?$/, {
        message: 'Duration must be in the format mm:ss or hh:mm:ss',
    })
    duration?: string;
}


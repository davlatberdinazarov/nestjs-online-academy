import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateLessonDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    videoUrl: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{1,2}:\d{2}(:\d{2})?$/, {
        message: 'Duration must be in the format mm:ss or hh:mm:ss',
    })
    duration: string;
}

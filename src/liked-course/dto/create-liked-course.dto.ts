import { IsNotEmpty } from "class-validator";

export class CreateLikedCourseDto {
    @IsNotEmpty()
    userId: number;

    @IsNotEmpty()
    courseId: number;
}

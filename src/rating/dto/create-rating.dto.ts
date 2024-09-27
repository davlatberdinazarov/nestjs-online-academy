import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateRatingDto {
    @IsNotEmpty()
    courseId: number; // Kurs ID'si

    @IsNotEmpty()  // Bu maydon to'ldirilishi kerak
    @IsNumber()
    @Min(1)
    @Max(5)  // Reyting 1 dan 5 gacha bo'lishi kerak
    value: number; // Reyting (1-5 o'rtasida)

    @IsOptional()
    @IsString()
    comment?: string; // Talabaning sharhi (ixtiyoriy)

    // userId ni qo'shish
    userId?: number;
}

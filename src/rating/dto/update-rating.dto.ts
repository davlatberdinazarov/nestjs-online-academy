import { IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';

export class UpdateRatingDto {
    @IsNumber()
    @Min(1)
    @Max(5)  // Reyting 1 dan 5 gacha bo'lishi kerak
    value?: number; // Reyting (1-5 o'rtasida)

    @IsOptional()
    @IsString()
    comment?: string; // Talabaning sharhi (ixtiyoriy)
}

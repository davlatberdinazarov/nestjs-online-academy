// create-user.dto.ts
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  fullName: string; // To'liq ism

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsEnum(UserRole)
  role?: UserRole; // Optional: foydalanuvchi rolini berish mumkin
}

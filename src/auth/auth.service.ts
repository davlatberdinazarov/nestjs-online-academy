import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './jwt-payload.interface'; // Import qilish

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Foydalanuvchini tekshirish
  async validateUser(phone: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByPhone(phone); // username o'rniga phone ishlatyapsiz
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result; // Parolni olib tashlab, qolgan ma'lumotlarni qaytaradi
    }
    return null;
  }

  // Login jarayoni
  async login(phone: string, password: string) {
    const user = await this.validateUser(phone, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { 
      phone: user.phone,  // JWT ichida phone bo'lsin
      role: user.role 
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

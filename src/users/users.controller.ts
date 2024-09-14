import { Controller, Post, Body, Get, Param, Patch, Req, UseGuards, ForbiddenException, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from './interfaces/request-with-user.interface';
import { UserRole } from './entities/user.entity';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // Foydalanuvchini yaratish
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    // Foydalanuvchini yaratishda avtomatik ravishda roli `STUDENT` bo'ladi
    return this.usersService.create(createUserDto);
  }


  // Mentor yaratish (faqat adminlar)
  @Post('create-mentor')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async createMentor(
    @Body() createUserDto: CreateUserDto,
    @Req() req: RequestWithUser,
  ) {
    return this.usersService.createMentor(createUserDto, UserRole.ADMIN);
  }
  // Mentor yaratish (faqat adminlar)
  @Post('create-admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async createAdmin(
    @Body() createUserDto: CreateUserDto,
    @Req() req: RequestWithUser,
  ) {
    return this.usersService.createAdmin(createUserDto, UserRole.ADMIN);
  }


  // Barcha foydalanuvchilarni olish
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    return this.usersService.findAll();
  }

  // Rolga qarab foydalanuvchilarni olish
  @Get('role/:role')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAllByRole(@Param('role') role: UserRole, @Req() req: RequestWithUser) {
    const currentUser = req.user;
    // Admin rolidagi foydalanuvchilar har qanday rolni ko'rishi mumkin
    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can view users by role');
    }

    return this.usersService.findAllByRole(role);
  }

  // ID bo'yicha foydalanuvchini olish
  @Get('single/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Get('by-phone/:phone')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  async findOneByPhone(@Param('phone') phone: string) {
    return this.usersService.findOneByPhone(phone);
  }

  // Mentorlarni tokenisiz olish @Get('mentors')  @Get('mentors')
  @Get('mentors')
  async findMentors() {
    return this.usersService.findAllMentors();
  }

  @Get('mentors/:id')
  async findMentorById(@Param('id') id: number) {
    return this.usersService.findMentorById(id);
  }

  @Patch('update/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: CreateUserDto,
    @Req() req: RequestWithUser
  ) {
    const currentUser = req.user;
    return this.usersService.update(id, updateUserDto, currentUser.role);
  }
  

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: number, @Req() req: RequestWithUser) {
    const currentUser = req.user;
    return this.usersService.delete(id, currentUser.role);
  }
}

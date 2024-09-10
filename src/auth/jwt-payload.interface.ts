export interface JwtPayload {
  username: string;  // Foydalanuvchining username'i (yoki email, login identifikatori)
  role: string;      // Foydalanuvchi roli (Admin, Mentor, Student)
}

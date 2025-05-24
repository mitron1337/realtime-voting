import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';

class LoginDto {
  email: string;
  password: string;
}

class RegisterDto {
  name: string;
  email: string;
  password: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Tizimga kirish' })
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto.email, loginDto.password);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'Ro\'yxatdan o\'tish' })
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto.name, registerDto.email, registerDto.password);
    } catch (error) {
      return { error: error.message };
    }
  }
}
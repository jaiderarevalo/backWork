import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { loginUser } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtservice: JwtService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async create(@Body() loginUserDto: loginUser) {
    const user = await this.userService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    if (!user) {
      throw new HttpException(
        'Email o contraseña incorrecta',
        HttpStatus.BAD_REQUEST,
      );
    }
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtservice.sign(payload);
    const { email, role } = user;
    return { accessToken, email, role };
  }
}

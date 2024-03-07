import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '@/user/user.service';
import { Auth } from './decorators/auth.decorator';
import { Role } from '@/interfaces/role.enum';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { loginUser } from '@/user/dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('create')
  @HttpCode(200)
  @Auth(Role.User,Role.Employe) //sepueden utilizar varios roles en solo endpoint
  async create(@Body() CreateuserDto: CreateUserDto) {
    console.log('lo que llega De dto', CreateuserDto);

    if (CreateuserDto.password !== CreateuserDto.confirmPassword) {
      throw new HttpException(
        'Las contraseñas no coinciden',
        HttpStatus.BAD_REQUEST,
      );
    }
   
    const user = await this.userService.create(CreateuserDto);
    const { email, name, role } = user as any;
    return { email, name, role };
  }
  
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginUserDto: loginUser) {
    console.log(" lo que llega del login ", loginUserDto);
    
    const user = await this.userService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    console.log("respuesta del user", user);
    
    if (!user) {
      throw new HttpException(
        'Email o contraseña incorrecta',
        HttpStatus.BAD_REQUEST,
      );
    }
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    const { email, role } = user;
    return { accessToken, email, role };
  }
}

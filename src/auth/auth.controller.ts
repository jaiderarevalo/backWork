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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /*   @Post('create')
  @HttpCode(200)
  async login (@Body login) */

  @Post('create')
  @HttpCode(200)
  @Auth(Role.User)
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
}

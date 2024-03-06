import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const salt = await bcrypt.genSalt(10);
      const res = this.userRepository.save({
        email: createUserDto.email,
        name: createUserDto.name,
        password: await bcrypt.hash(createUserDto.password, salt),
        role: createUserDto.role,
      });
      if (!res) {
        throw new HttpException(`${res}`, HttpStatus.BAD_REQUEST);
      }
      return res;
    } catch (error) {
      throw new HttpException(
        `${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findOne(id: string): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }
  async checkPassword(users: User, password: string): Promise<boolean> {
    try {
      const res = bcrypt.compareSync(password, users.password);
      return res;
    } catch (error) {}
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        return null;
      }
      const isPasswordValid = await this.checkPassword(user, password);
      if (!isPasswordValid) {
        throw new HttpException(
          'Email o Contraseña incorrecta',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {}
  }
}

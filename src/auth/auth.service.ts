import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces';
import type { CreateUserDto, LoginUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      })

      await this.userRepository.save(user)

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      }
    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, fullName } = loginUserDto

    const user = await this.userRepository.findOne({
      where: { fullName },
      select: { fullName: true, password: true, id: true }
    })

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email or password)')

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (email or password)')

    return {
      user,
      token: this.getJwtToken({ id: user.id })
    }
  }

  checkAuthStatus(user) {

    return {
      user,
      token: this.getJwtToken({id: user.id}),
    }
  }

  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload)

    return token
  }

  private handleDBErrors(error: any): never {
    if (error.code === "23505")
      throw new BadRequestException(error.detail)

    console.log(error)

    throw new InternalServerErrorException('Please check server logs')

  }
}

import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserCredentialsService } from '../user-credentials/user-credentails.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private userCredentialsService: UserCredentialsService,
    private jwtService: JwtService,
  ) {}

  async register({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) {
    const createdUser = await this.usersService.createOne({
      email,
      name,
    });
    await this.userCredentialsService.createOne({
      password,
      userId: createdUser.id,
    });
    return createdUser;
  }

  async login(payload: { email: string; password: string }) {
    const { email, password } = payload;
    const user = await this.usersService.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new UnprocessableEntityException('Not found user');
    }
    const userCredential = await this.userCredentialsService.findByUserId(
      user.id,
    );
    if (!userCredential) {
      throw new UnprocessableEntityException('Not found user credential');
    }
    const isMatch = await bcrypt.compare(password, userCredential.password);

    if (!isMatch) {
      throw new UnprocessableEntityException('Password not match');
    }
    const accessToken = await this.jwtService.signAsync({
      id: user.id,
    });
    return {
      accessToken,
    };
  }
}

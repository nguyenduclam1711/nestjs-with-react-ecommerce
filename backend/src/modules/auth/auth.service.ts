import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserCredentialsService } from '../user-credentials/user-credentails.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_EXPIRATION,
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_EXPIRATION,
  REFRESH_TOKEN_SECRET_KEY,
} from 'src/constants/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private userCredentialsService: UserCredentialsService,
    private jwtService: JwtService,
  ) {}

  async generateTokens(payload: { id: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: ACCESS_TOKEN_SECRET_KEY,
        expiresIn: ACCESS_TOKEN_EXPIRATION,
      }),
      this.jwtService.signAsync(payload, {
        secret: REFRESH_TOKEN_SECRET_KEY,
        expiresIn: REFRESH_TOKEN_EXPIRATION,
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

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
    return this.generateTokens({
      id: user.id,
    });
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: REFRESH_TOKEN_SECRET_KEY,
      });
      return this.generateTokens({
        id: payload.id,
      });
    } catch {
      throw new UnauthorizedException();
    }
  }
}

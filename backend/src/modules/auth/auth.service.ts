import {
  Inject,
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
  REFRESH_TOKEN_EXPIRATION_TIME_IN_REDIS,
  REFRESH_TOKEN_SECRET_KEY,
} from 'src/constants/jwt';
import { PROVIDER } from 'src/constants/provider';
import Redis from 'ioredis';
import { UserRolesService } from '../user-roles/user-roles.service';
import { ROLE_DEFAULT_CODE } from 'src/constants/role';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private userCredentialsService: UserCredentialsService,
    private jwtService: JwtService,
    @Inject(PROVIDER.REDIS_CLIENT)
    private redis: Redis,
    private userRolesService: UserRolesService,
  ) {}

  getRedisAccessTokenKey(refreshToken: string) {
    return `refreshToken:${refreshToken}`;
  }

  async setRedisAccessToken(refreshToken: string, accessToken: string) {
    const redisKey = this.getRedisAccessTokenKey(refreshToken);
    // pair accessToken with refreshToken
    await this.redis.set(redisKey, accessToken);
    await this.redis.expire(redisKey, REFRESH_TOKEN_EXPIRATION_TIME_IN_REDIS);
  }

  async getRedisAccessToken(refreshToken: string) {
    return this.redis.get(this.getRedisAccessTokenKey(refreshToken));
  }

  async deleteRedisRefreshToken(refreshToken: string) {
    const redisKey = this.getRedisAccessTokenKey(refreshToken);
    return this.redis.del(redisKey);
  }

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
    await this.setRedisAccessToken(refreshToken, accessToken);
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
    await Promise.all([
      this.userCredentialsService.createOne({
        password,
        userId: createdUser.id,
      }),
      this.userRolesService.createOne({
        userId: createdUser.id,
        roleCode: ROLE_DEFAULT_CODE.BUYER,
      }),
    ]);
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

  async refreshAccessToken(refreshToken: string, accessToken: string) {
    const payload = await this.jwtService
      .verifyAsync(refreshToken, {
        secret: REFRESH_TOKEN_SECRET_KEY,
      })
      .catch(() => {
        throw new UnauthorizedException();
      });
    const redisAccessToken = await this.getRedisAccessToken(refreshToken);
    if (!redisAccessToken || redisAccessToken !== accessToken) {
      throw new UnauthorizedException();
    }
    await this.deleteRedisRefreshToken(refreshToken);
    return this.generateTokens({
      id: payload.id,
    });
  }
}

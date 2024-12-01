import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PasswordUtil } from 'src/common/utils/password.util';

@Injectable()
export class UserCredentialsService {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: number) {
    return this.prisma.userCredential.findFirst({
      where: {
        userId,
      },
    });
  }

  async createOne(
    data: Prisma.XOR<
      Prisma.UserCredentialCreateInput,
      Prisma.UserCredentialUncheckedCreateInput
    >,
  ) {
    const { password, ...restData } = data;
    const hashedPassword = await PasswordUtil.generateHashedPassword(password);
    return this.prisma.userCredential.create({
      data: {
        ...restData,
        password: hashedPassword,
      },
    });
  }
}

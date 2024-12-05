import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { PasswordUtil } from 'src/common/utils/password.util';
import { PrismaBaseService } from 'src/common/services/permission-code.service';

@Injectable()
export class UserCredentialsService extends PrismaBaseService<
  PrismaClient['userCredential']
> {
  constructor(private prisma: PrismaService) {
    super(prisma.userCredential);
  }

  async findByUserId(userId: number) {
    return this.prismaModel.findFirst({
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
    return this.prismaModel.create({
      data: {
        ...restData,
        password: hashedPassword,
      },
    });
  }
}

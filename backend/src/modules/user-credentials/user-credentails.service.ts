import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return this.prisma.userCredential.create({
      data: {
        ...restData,
        password: hashedPassword,
      },
    });
  }
}

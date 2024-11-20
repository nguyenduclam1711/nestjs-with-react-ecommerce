import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(arg: {
    where?: Prisma.UserWhereUniqueInput;
    select?: Prisma.UserSelectScalar;
  }) {
    return this.prisma.user.findFirst({
      where: arg.where,
      select: arg.select,
    });
  }

  async createOne(
    data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>,
  ) {
    return this.prisma.user.create({
      data,
    });
  }
}

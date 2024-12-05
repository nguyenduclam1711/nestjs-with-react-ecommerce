import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaBaseService } from 'src/common/services/permission-code.service';

@Injectable()
export class UsersService extends PrismaBaseService<PrismaClient['user']> {
  constructor(private prisma: PrismaService) {
    super(prisma.user);
  }

  async findOne(arg: {
    where?: Prisma.UserWhereUniqueInput;
    select?: Prisma.UserSelectScalar;
  }) {
    return this.prismaModel.findFirst({
      where: arg.where,
      select: arg.select,
    });
  }

  async createOne(
    data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>,
  ) {
    return this.prismaModel.create({
      data,
    });
  }
}

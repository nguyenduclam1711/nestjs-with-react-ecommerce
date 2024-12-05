import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaBaseService } from 'src/common/services/permission-code.service';

@Injectable()
export class UserRolesService extends PrismaBaseService<
  PrismaClient['userRole']
> {
  constructor(private prisma: PrismaService) {
    super(prisma.userRole);
  }

  async findMany(args: Parameters<typeof this.prisma.userRole.findMany>[0]) {
    return this.prismaModel.findMany(args);
  }

  async createOne(
    data: Prisma.XOR<
      Prisma.UserRoleCreateInput,
      Prisma.UserRoleUncheckedCreateInput
    >,
  ) {
    return this.prismaModel.create({
      data,
    });
  }
}

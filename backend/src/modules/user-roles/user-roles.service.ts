import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRolesService {
  constructor(private prisma: PrismaService) {}

  async findMany(args: Parameters<typeof this.prisma.userRole.findMany>[0]) {
    return this.prisma.userRole.findMany(args);
  }

  async createOne(
    data: Prisma.XOR<
      Prisma.UserRoleCreateInput,
      Prisma.UserRoleUncheckedCreateInput
    >,
  ) {
    return this.prisma.userRole.create({
      data,
    });
  }
}

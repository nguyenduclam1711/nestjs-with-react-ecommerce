import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRolesService {
  constructor(private prisma: PrismaService) {}

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

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaBaseService } from 'src/common/services/permission-code.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PermissionsService extends PrismaBaseService<
  PrismaClient['permission']
> {
  constructor(private prisma: PrismaService) {
    super(prisma.permission);
  }

  async getPermissions() {
    return this.prismaModel.findMany();
  }
}

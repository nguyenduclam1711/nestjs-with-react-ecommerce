import { Injectable } from '@nestjs/common';
import { PrismaBaseService } from 'src/common/services/permission-code.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class RolesService extends PrismaBaseService<PrismaClient['role']> {
  constructor(private prisma: PrismaService) {
    super(prisma.role);
  }
}

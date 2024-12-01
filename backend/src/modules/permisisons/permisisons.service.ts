import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject(PrismaService)
    private prisma: PrismaService,
  ) {}

  async getPermissions() {
    return this.prisma.permisison.findMany();
  }
}

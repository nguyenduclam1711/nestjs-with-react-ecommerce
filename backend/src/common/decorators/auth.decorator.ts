import { applyDecorators, UseGuards } from '@nestjs/common';
import { Permissions } from './permissions.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppGuard } from '../guards/app.guard';

export function Auth(...permissions: string[]) {
  return applyDecorators(
    Permissions(permissions),
    UseGuards(AppGuard),
    ApiBearerAuth(),
  );
}

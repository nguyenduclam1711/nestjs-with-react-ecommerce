import { Module } from '@nestjs/common';
import { PermissionsService } from './permisisons.service';

@Module({
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}

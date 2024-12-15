import { Module } from '@nestjs/common';
import { UserCredentialsService } from './user-credentials.service';
import { UserCredentialsController } from './user-credentials.controller';

@Module({
  providers: [UserCredentialsService],
  controllers: [UserCredentialsController],
  exports: [UserCredentialsService],
})
export class UserCredentialsModule {}

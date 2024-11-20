import { Module } from '@nestjs/common';
import { UserCredentialsService } from './user-credentails.service';

@Module({
  providers: [UserCredentialsService],
  exports: [UserCredentialsService],
})
export class UserCredentialsModule {}

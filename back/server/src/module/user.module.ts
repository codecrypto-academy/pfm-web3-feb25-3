import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { UserController } from '../web/rest/user.controller';
import { ManagementController } from '../web/rest/management.controller';
import { UserService } from '../service/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController, ManagementController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AppModule } from 'src/app.module';
import { OauthService } from 'src/oauth/oauth.service';
import MessageService from 'src/messageService.service';
import { UsersService } from 'src/users/users.service';

@Module({
  exports: [AuthService, OauthService, MessageService, UsersService],
  providers: [AuthService, OauthService, MessageService, UsersService],
  controllers: [AuthController]
})
export class AuthModule {}

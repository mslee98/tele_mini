import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { LocalSerializer } from './local.serializer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { TelegramStrategy } from './telegram.strategy';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), PassportModule.register({session: true})],
  providers: [AuthService, UserService, LocalStrategy, LocalSerializer, TelegramStrategy],
  exports: [AuthModule]
})
export class AuthModule {}

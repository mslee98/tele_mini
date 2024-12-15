import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    usersService: any;
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>
    ) {

    }
    
    async validateUser(email: string, password: string) {

        const user = await this.usersRepository.findOne({
          where: { email },
          select: ['id', 'firstName', 'lastName', 'email', 'nickname', 'password', 'money', 'isFirstVisit'],
        });
        if (!user) {
          return null;
        }
        const result = await bcrypt.compare(password, user.password);
        if (result) {
          const { password, ...userWithoutPassword } = user;
          // 다른식으로 쓴다면 delelte user.password를 뺄 수도 있음
          return userWithoutPassword;
        }
        return null;
      }

    async validateTelegramUser(tele_id: string): Promise<any> {

      const user = await this.usersService.telUserInfo(tele_id);
      if (user) {
        return user;
      }
      return null;
    }
}

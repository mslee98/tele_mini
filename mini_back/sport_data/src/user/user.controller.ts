import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CreateTeleUserDto } from './dto/createTeleUserDto';
import { UserService } from './user.service';
import { query } from 'express';
import { Users } from 'src/entities/Users';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { User } from 'src/common/decorators/user.decorator';
import { JoinRequestDto } from './dto/join.request.dto';
import { TelegramAuthGuard } from 'src/auth/telegram-auth.guard';


@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get()
    getUsers(@User() user) { // Request에 대한 정보는 @Req/@Request 를 통해 가져올 수 있음 | Response 데이터는 @Res/@Response
        return user || false;    
    }

    @Get(':userId')
    getTelUserInfo(@Param('id') id: string) {
        return this.userService.telUserInfo(id);
    }

    @Post() 
    postTelUser(@Body() body: CreateTeleUserDto) {
        return this.userService.userCheck(body.user_id, body.first_name, body.last_name);
    }

    @Post('/signup')
    async join(@Body() body: JoinRequestDto) {
        await this.userService.postUsers(body.email, body.nickName, body.password, body.firstName, body.lastName);

    }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    login(@User() user) {
        return user;
    }

    @UseGuards(TelegramAuthGuard)
    @Post('telegram-login')
    async telegramLogin(@User() user) {

        return user || false;    
    }


    @Post('updateMoney')
    updateMoney(@Body('id') id: number, @Body('newMoney') money: number ) {

        console.log("#############################################")
        console.log(id, money);
        console.log("#############################################")
        
        return this.userService.postMoney(id, money);
    }
    

}

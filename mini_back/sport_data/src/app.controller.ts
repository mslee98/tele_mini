import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
import * as flatted from 'flatted';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('data')
  async dataSort() {

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줍니다.
    const day = String(date.getDate()).padStart(2, '0');

    const requestDate = `${year}-${month}-${day}`;

    const resData = await axios.get(`https://sports-api.named.com/v1.0/popular-games?date=${requestDate}&tomorrow-game-flag=true`)

    const baseball = resData.data.baseball;

    // return this.appService.dataSort(baseball);
    return null;
  }

}

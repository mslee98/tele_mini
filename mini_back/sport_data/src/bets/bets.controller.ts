import { Body, Controller, Post } from '@nestjs/common';
import { BetsService } from './bets.service';

@Controller('bets')
export class BetsController {
    constructor(

        private betsService: BetsService

    ) {

    }


    @Post()
    saveBet(@Body('betData') betData: any) {

        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
        console.log(betData)

        this.betsService.saveBet(betData)

        return "성공";

    }


}

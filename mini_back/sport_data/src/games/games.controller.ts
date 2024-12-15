import { Controller, Get } from '@nestjs/common';
import { GamesService } from './games.service';
import { dirname } from 'path';

@Controller('games')
export class GamesController {
    constructor(
        private gameService: GamesService
    ) {

    }

    @Get()
    async games() {

        console.log(dirname)

        return await this.gameService.getGamesList() 
    }

}

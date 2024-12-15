import { Body, Controller, Post } from '@nestjs/common';
import { OddsService } from './odds.service';

@Controller('odds')
export class OddsController {
    constructor(
        private oddsService: OddsService
    )  {}


    @Post('save')
    async oddsSave(@Body() data: any) {
        await this.oddsService.saveOdds(data);
        return {message: 'Odds saved successfully'}
    }
}

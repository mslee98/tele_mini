import { Module } from '@nestjs/common';
import { OddsController } from './odds.controller';
import { OddsService } from './odds.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Games } from 'src/entities/Games';
import { Odds } from 'src/entities/Odds';
import { Customodds } from 'src/entities/Customodds';
import { Windrawloseodds } from 'src/entities/Windrawloseodds';
import { Handicapodds } from 'src/entities/Handicapodds';
import { Overunderodds } from 'src/entities/Overunderodds';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Games,
      Odds,
      Customodds,
      Windrawloseodds,
      Handicapodds,
      Overunderodds
    ])
  ],
  controllers: [OddsController],
  providers: [OddsService]
})
export class OddsModule {}

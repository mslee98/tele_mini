import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Games } from 'src/entities/Games';
import { Teams } from 'src/entities/Teams';
import { Seasons } from 'src/entities/Seasons';
import { Periods } from 'src/entities/Periods';
import { Odds } from 'src/entities/Odds';
import { Customodds } from 'src/entities/Customodds';
import { Windrawloseodds } from 'src/entities/Windrawloseodds';
import { Handicapodds } from 'src/entities/Handicapodds';
import { Overunderodds } from 'src/entities/Overunderodds';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Games,
      Teams,
      Seasons,
      Periods,
      Odds,
      Customodds,
      Windrawloseodds,
      Handicapodds,
      Overunderodds
    ])
  ],
  controllers: [GamesController],
  providers: [GamesService]
})
export class GamesModule {}

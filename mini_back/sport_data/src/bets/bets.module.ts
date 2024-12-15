import { Module } from '@nestjs/common';
import { BetsController } from './bets.controller';
import { BetsService } from './bets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Games } from 'src/entities/Games';
import { Odds } from 'src/entities/Odds';
import { Users } from 'src/entities/Users';
import { Bets } from 'src/entities/Bets';
import { ComboBets } from 'src/entities/ComboBets';
import { SingleBets } from 'src/entities/SingleBets';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Odds,
      Users,
      Bets,
      ComboBets,
      SingleBets,
    ])
  ],
  controllers: [BetsController],
  providers: [BetsService]
})
export class BetsModule {}

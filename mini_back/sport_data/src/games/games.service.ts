import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customodds } from 'src/entities/Customodds';
import { Games } from 'src/entities/Games';
import { Handicapodds } from 'src/entities/Handicapodds';
import { Odds } from 'src/entities/Odds';
import { Overunderodds } from 'src/entities/Overunderodds';
import { Periods } from 'src/entities/Periods';
import { Seasons } from 'src/entities/Seasons';
import { Teams } from 'src/entities/Teams';
import { Windrawloseodds } from 'src/entities/Windrawloseodds';
import { Repository } from 'typeorm';

@Injectable()
export class GamesService {
    constructor(
        @InjectRepository(Games)
        private gamesRepository: Repository<Games>,

        @InjectRepository(Teams)
        private teamsRepository: Repository<Teams>,

        @InjectRepository(Seasons)
        private seasonsRepository: Repository<Seasons>,

        @InjectRepository(Periods)
        private periodsRepository: Repository<Periods>,

        @InjectRepository(Customodds)
        private customoddsRepository: Repository<Customodds>,

        @InjectRepository(Windrawloseodds)
        private windrawloseoddsRepository: Repository<Windrawloseodds>,

        @InjectRepository(Handicapodds)
        private handicapoddsRepository: Repository<Handicapodds>,

        @InjectRepository(Overunderodds)
        private overunderoddsRepository: Repository<Overunderodds>,

    
    ) {

    }

    async getGamesList(@Query('date') date?: string) {

      let todayString: string;

      if (date) {
        todayString = date;
      } else {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        todayString = `${yyyy}-${mm}-${dd}`;
      }

      const query = await this.gamesRepository
        .createQueryBuilder('g')
        .select([
          'g.game_id AS gameId',
          's.season_name AS seasonName',
          'ht.team_name_kr AS homeTeamName',
          'ht.team_short_name_kr AS homeShortName',
          'ht.logo_path AS homeLogoPath',
          'at.team_name_kr AS awayTeamName',
          'at.logo_path AS awayLogoPath',
          'at.team_short_name_kr AS awayShortName',
          'g.game_date AS gameDate',
          'g.home_score AS homeScore',
          'g.away_score AS awayScore',
          'g.game_status AS gameStatus',
          'o.odds_id AS oddsId',
          "JSON_ARRAYAGG(DISTINCT JSON_OBJECT('periodNumber', p.period_number, 'periodHomeScore', p.home_team_score, 'periodAwayScore', p.away_team_score)) AS periods",
          "JSON_ARRAYAGG(DISTINCT JSON_OBJECT('id', ou.over_under_id, 'over', ou.over, 'under', ou.under, 'point', ou.point)) AS overUnder",
          "JSON_ARRAYAGG(DISTINCT JSON_OBJECT('id', wd.win_draw_lose_id,'win', wd.win, 'draw', wd.draw, 'lose', wd.lose)) AS winDrawLose",
          "JSON_ARRAYAGG(DISTINCT JSON_OBJECT('id', ho.handicap_id,'value', ho.value, 'win', ho.win, 'lose', ho.lose)) AS handicap",
          "JSON_ARRAYAGG(DISTINCT JSON_OBJECT('id', co.custom_odds_id,'description', co.description, 'value', co.value)) AS customOdds"
        ])
        .innerJoin(Teams, 'ht', 'g.home_team_id = ht.team_id')
        .innerJoin(Teams, 'at', 'g.away_team_id = at.team_id')
        .innerJoin(Seasons, 's', 'g.season_id = s.season_id')
        .leftJoin(Periods, 'p', 'g.game_id = p.game_id')
        .leftJoin(Odds, 'o', 'g.game_id = o.game_id')
        .leftJoin(Overunderodds, 'ou', 'o.odds_id = ou.odds_id')
        .leftJoin(Windrawloseodds, 'wd', 'o.odds_id = wd.odds_id')
        .leftJoin(Handicapodds, 'ho', 'o.odds_id = ho.odds_id')
        .leftJoin(Customodds, 'co', 'o.odds_id = co.odds_id')
        .where('DATE(g.game_date) = :today', { today: todayString })
        .groupBy('g.game_id, s.season_name, ht.team_name_kr, ht.team_short_name_kr, ht.logo_path, at.team_name_kr, at.team_short_name_kr, at.logo_path, g.game_date, g.home_score, g.away_score, g.game_status')
        .orderBy('g.game_date', 'DESC')
        .addOrderBy('p.period_number', 'ASC')
        .getRawMany();

        return query;

    }
}

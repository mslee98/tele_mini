import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Games } from 'src/entities/Games';
import { Leagues } from 'src/entities/Leagues';
import { Periods } from 'src/entities/Periods';
import { Teams } from 'src/entities/Teams';
import { Users } from 'src/entities/Users';
import { Favorites } from 'src/entities/Favorites';
import { Odds } from 'src/entities/Odds';
import { Seasons } from 'src/entities/Seasons';
import { Customodds } from 'src/entities/Customodds';
import { Handicapodds } from 'src/entities/Handicapodds';
import { Overunderodds } from 'src/entities/Overunderodds';
import { Windrawloseodds } from 'src/entities/Windrawloseodds';
import { Bets } from 'src/entities/Bets';
import { ComboBets } from 'src/entities/ComboBets';
import { SingleBets } from 'src/entities/SingleBets';

dotenv.config();

const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '1234',
  database: 'mini',
    entities: [
      Bets,
      ComboBets,
      Customodds,
      Favorites,
      Games,
      Handicapodds,
      Leagues,
      Odds,
      Overunderodds,
      Periods,
      Seasons,
      SingleBets,
      Teams,
      Users,
      Windrawloseodds
    ],
  migrations: [__dirname + '/src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});

export default dataSource;

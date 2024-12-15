import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { Favorites } from './entities/Favorites';
import { Games } from './entities/Games';
import { Leagues } from './entities/Leagues';
import { Periods } from './entities/Periods';
import { Users } from './entities/Users';
import { Teams } from './entities/Teams';
import { GamesModule } from './games/games.module';
import { NamedModule } from './named/named.module';
import { Odds } from './entities/Odds';
import { Seasons } from './entities/Seasons';
import { OddsModule } from './odds/odds.module';
import { Customodds } from './entities/Customodds';
import { Handicapodds } from './entities/Handicapodds';
import { Overunderodds } from './entities/Overunderodds';
import { Windrawloseodds } from './entities/Windrawloseodds';
import { Bets } from './entities/Bets';
import { BetsModule } from './bets/bets.module';
import { ComboBets } from './entities/ComboBets';
import { SingleBets } from './entities/SingleBets';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'mini',
      autoLoadEntities: true,
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
      keepConnectionAlive: true,
      migrations: [__dirname + '/migrations/*.ts'],
      charset: 'utf8mb4_general_ci',
      synchronize: true,
      logging: true,
    }),
    UserModule,
    GamesModule,
    NamedModule,
    OddsModule,
    BetsModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

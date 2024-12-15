import { Module } from '@nestjs/common';
import { NamedController } from './named.controller';
import { NamedService } from './named.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Games } from 'src/entities/Games';
import { Periods } from 'src/entities/Periods';
import { Seasons } from 'src/entities/Seasons';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Games,
      Periods,
      Seasons
    ])
  ],
  controllers: [NamedController],
  providers: [NamedService]
})
export class NamedModule {}

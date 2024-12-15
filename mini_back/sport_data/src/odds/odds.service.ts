import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customodds } from 'src/entities/Customodds';
import { Games } from 'src/entities/Games';
import { Handicapodds } from 'src/entities/Handicapodds';
import { Odds } from 'src/entities/Odds';
import { Overunderodds } from 'src/entities/Overunderodds';
import { Windrawloseodds } from 'src/entities/Windrawloseodds';
import { Repository, QueryRunner, DataSource } from 'typeorm';

@Injectable()
export class OddsService {
  constructor(
    @InjectRepository(Odds)
    private oddsRepository: Repository<Odds>,
    
    @InjectRepository(Games)
    private gamesRepository: Repository<Games>,

    @InjectRepository(Windrawloseodds)
    private windrawloseoddsRepository: Repository<Windrawloseodds>,

    @InjectRepository(Handicapodds)
    private handicapoddsRepository: Repository<Handicapodds>,

    @InjectRepository(Overunderodds)
    private overunderoddsRepository: Repository<Overunderodds>,

    @InjectRepository(Customodds)
    private customoddsRepository: Repository<Customodds>,


    private dataSource: DataSource,
  ) {}

  async saveOdds(rawData: any) {

    console.log("@@@@@@@@@@@@@@@@@@@", rawData);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // 여기서 rawData에서 직접 구조 분해 할당을 합니다.
        const { gameId, winDrawLoseList, handicapList, overUnderList } = rawData;

        // 1. Odds 테이블에 기본 정보 저장
        const odds = this.oddsRepository.create({
            gameId,
            type: 'win_draw_lose',  // 초기 타입 설정, 이후 개별 배당 테이블에 추가
        });

        const savedOdds = await queryRunner.manager.save(odds);

        // 2. WinDrawLose 테이블에 배당 저장
        for (const winDrawLose of winDrawLoseList) {
            await queryRunner.manager.getRepository(Windrawloseodds).save({
                oddsId: savedOdds.oddsId,
                win: winDrawLose.win !== '' ? winDrawLose.win : null,
                draw: winDrawLose.draw !== '' ? winDrawLose.draw : null,
                lose: winDrawLose.lose !== '' ? winDrawLose.lose : null,
            });
        }
        
        // 3. Handicap 테이블에 배당 저장
        for (const handicap of handicapList) {
            await queryRunner.manager.getRepository(Handicapodds).save({
                oddsId: savedOdds.oddsId,
                value: handicap.value !== '' ? handicap.value : null,
                win: handicap.win !== '' ? handicap.win : null,
                lose: handicap.lose !== '' ? handicap.lose : null,
            });
        }
        
        // 4. OverUnder 테이블에 배당 저장
        for (const overUnder of overUnderList) {
            await queryRunner.manager.getRepository(Overunderodds).save({
                oddsId: savedOdds.oddsId,
                point: overUnder.point !== '' ? overUnder.point : null,
                over: overUnder.over !== '' ? overUnder.over : null,
                under: overUnder.under !== '' ? overUnder.under : null,
            });
        }

        // 5. 해당 게임에 oddsId를 업데이트
        const game = await this.gamesRepository.findOne({ where: { gameId } });
        if (!game) {
            throw new Error('Game not found');
        }

        game.oddsId = savedOdds.oddsId;
        await queryRunner.manager.save(game);

        // 6. 트랜잭션 커밋
        await queryRunner.commitTransaction();
    } catch (err) {
        // 트랜잭션 롤백
        await queryRunner.rollbackTransaction();
        throw new Error(`Failed to save odds: ${err.message}`);
    } finally {
        // 연결 해제
        await queryRunner.release();
    }
}
}

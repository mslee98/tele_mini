import { Injectable } from '@nestjs/common';
import { Bets } from 'src/entities/Bets';
import { ComboBets } from 'src/entities/ComboBets';
import { Odds } from 'src/entities/Odds';
import { SingleBets } from 'src/entities/SingleBets';
import { Users } from 'src/entities/Users';
import { DataSource } from 'typeorm';

@Injectable()
export class BetsService {
    constructor(
        
        private dataSource: DataSource

    ) {

    }

    async saveBet(betData: any) {

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        
        
        try {

            const user = await queryRunner.manager.getRepository(Users).findOne({
                where: { teleId: betData.userId },
                select: ["id", "money"], // money 필드도 가져옵니다.
            });
    
            if (!user) {
                throw new Error('User not found');
            }
    
            const userId = user.id;
            const totalBetAmount = betData.betType === 'combo' ? betData.stake : betData.odds.reduce((sum: number, odd: any) => sum + odd.stake, 0);
    
            // 유저의 money를 차감
            const updatedMoney = user.money - totalBetAmount;
    
            if (updatedMoney < 0) {
                throw new Error('Insufficient funds');
            }
    
            await queryRunner.manager.getRepository(Users).update(userId, { money: updatedMoney });
    
            if (updatedMoney < 0) {
                throw new Error('Insufficient funds');
            }
    
            await queryRunner.manager.getRepository(Users).update(userId, { money: updatedMoney });

            

             // Step 2: Bets 테이블에 데이터 저장 (공통 부분)
            const betRecord = await queryRunner.manager.getRepository(Bets).save({
                userId: userId,
                betType: betData.betType,
                stake: betData.betType === 'combo' ? betData.stake : betData.odds.reduce((sum: number, odd: any) => sum + odd.stake, 0),
                potentialWin: betData.totalPotentialWin,
            });

            // Step 3: betType에 따라 싱글/콤보 처리
            if (betData.betType === 'combo') {
                // Combo 배팅 처리
                for (const odd of betData.odds) {

                    console.log(odd)

                    await queryRunner.manager.getRepository(ComboBets).save({
                        betId: betRecord.betId,
                        oddsId: odd.oddsId,
                        gameId: odd.gameId,
                        value: odd.value,
                        category: odd.category,
                        label: odd.label,
                        potential: odd.potential,
                        potentialWin: betData.totalPotentialWin,
                        stake: betData.stake,
                    });
                }
            } else if (betData.betType === 'single') {
                // Single 배팅 처리
                for (const odd of betData.odds) {
                    await queryRunner.manager.getRepository(SingleBets).save({
                        betId: betRecord.betId,
                        oddsId: odd.oddsId,
                        gameId: odd.gameId,
                        value: odd.value,
                        category: odd.category,
                        label: odd.label,
                        stake: odd.stake,
                        potential: odd.potential,
                        potentialWin: odd.potential
                    });
                }
            }

            await queryRunner.commitTransaction();
        } catch(error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release()
        }
    }
}

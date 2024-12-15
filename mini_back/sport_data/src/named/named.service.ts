import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
import { Games } from 'src/entities/Games';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { Periods } from 'src/entities/Periods';
import { Seasons } from 'src/entities/Seasons';

import * as xml2js from 'xml2js';

dotenv.config();

@Injectable()
export class NamedService {
    private leagueMapping: Record<number, { id: number; name: string; kr_name: string }>;
    private teamMapping: Record<number, { id: number; name: string; kr_name: string }>;

    
    private bet7mLeagueMapping: Record<number, { id: number; name: string; kr_name: string }>;
    private bet7mTeamMapping: Record<number, { id: number; name: string; kr_name: string }>;

    constructor(
        @InjectRepository(Games)
        private gamesRepository: Repository<Games>,

        @InjectRepository(Periods)
        private periodsRepository: Repository<Periods>,

        @InjectRepository(Seasons)
        private seasonsRepository: Repository<Seasons>,

        private dataSource: DataSource
    ) {
        const namedMappingFilePath = path.resolve(process.cwd(), process.env.NAMED_MAPPING_FILE_PATH);
        const mapping = JSON.parse(fs.readFileSync(namedMappingFilePath, 'utf8'));
        this.leagueMapping = mapping.leagues;
        this.teamMapping = mapping.teams;

        const bet7mMappingFilePath = path.resolve(process.cwd(), process.env.BET7M_MAPPING_FILE_PATH);
        const bet7mMapping = JSON.parse(fs.readFileSync(bet7mMappingFilePath, 'utf8'));
        this.bet7mLeagueMapping = bet7mMapping.leagues;
        this.bet7mTeamMapping = bet7mMapping.teams;
    }

    async saveNamedData(date: string) {
        // const dummyDataPath = path.resolve(process.cwd(), process.env.DUMMY_FILE_PATH);
        // const apiData = JSON.parse(fs.readFileSync(dummyDataPath, 'utf8'));
        
        let apiData;

        await axios.get(`https://sports-api.named.com/v1.0/popular-games?date=${date}&tomorrow-game-flag=true`)
            .then((res) => {
                apiData = res.data
            })
            

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            for (const sportsType of Object.keys(apiData)) {
                const games = apiData[sportsType].filter(game => this.leagueMapping[game.league.id]);
                for (const game of games) {
                    if (this.teamMapping[game.teams.home.id] && this.teamMapping[game.teams.away.id]) {
                        const league = this.mapLeague(game.league.id);
                        const homeTeam = this.mapTeam(game.teams.home.id);
                        const awayTeam = this.mapTeam(game.teams.away.id);

                        // 시즌을 먼저 확인하고 시즌을 생성하는 로직 추가
                        let season = await queryRunner.manager.getRepository(Seasons).findOne({
                            where: {
                                leagueId: league.id,
                                year: new Date(game.startDatetime).getFullYear()
                            },
                            select: ['seasonId']
                        });

                        
                        const periodScore = game.teams.home.periodData.map((period, index) => {
                            const awayPeriodData = game.teams.away.periodData?.[index];

                            return {
                                period: period.period,
                                homeTeamScore: period.score,
                                awayTeamScore: awayPeriodData ? awayPeriodData.score : 0
                            };
                        });

                        let existingGame = await queryRunner.manager.getRepository(Games).findOne({
                            where: {
                                seasonId: season.seasonId,
                                homeTeamId: homeTeam.id,
                                awayTeamId: awayTeam.id,
                                gameDate: new Date(game.startDatetime)
                            },
                            select: ['gameId']
                        });

                        if (existingGame && existingGame.gameId) {
                            console.log(`Game already exists: ${existingGame.gameId}, updating...`);
                            // 기존 게임 업데이트
                            existingGame.homeScore = game.teams.home.periodData.reduce((total, current) => total + current.score, 0);
                            existingGame.awayScore = game.teams.away.periodData.reduce((total, current) => total + current.score, 0);
                            existingGame.gameStatus = game.gameStatus;
                            existingGame.periodScore = JSON.stringify(periodScore); // JSON 형식으로 회차별 스코어 저장

                            await queryRunner.manager.getRepository(Games).save(existingGame);
                        } else {
                            console.log('Creating new game');
                            // 새 게임 생성
                            const gameInfo = {
                                seasonId: season.seasonId,
                                homeTeamId: homeTeam.id,
                                awayTeamId: awayTeam.id,
                                gameDate: new Date(game.startDatetime),
                                realStartDateTime: new Date(game.realStartDateTime),
                                homeScore: game.teams.home.periodData.reduce((total, current) => total + current.score, 0),
                                awayScore: game.teams.away.periodData.reduce((total, current) => total + current.score, 0),
                                gameStatus: game.gameStatus,
                                period: game.period, // 현재 진행 중인 회차
                                currentPeriod: game.inningDivision === "BOTTOM" ? "Bottom" : "Top", // 회차의 상/하 여부를 결정
                                timeElapsed: game.displayTime,
                                periodScore: JSON.stringify(periodScore), // 각 회차별 점수를 JSON으로 저장
                            };

                            existingGame = await queryRunner.manager.getRepository(Games).save(gameInfo);
                            console.log(`Saved game ID: ${existingGame.gameId}`);
                        }
                    }
                }
            }

            await queryRunner.commitTransaction();
        } catch (error) {
            console.error(error);
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getGamesList() {
        const query = `
            SELECT
                g.gameId,
                s.season_name AS seasonName,
                ht.team_name_en AS homeTeamName,
                at.team_name_en AS awayTeamName,
                g.gameDate,
                g.homeScore,
                g.awayScore,
                g.gameStatus
            FROM
                Games g
                JOIN Teams ht ON g.homeTeamId = ht.team_id
                JOIN Teams at ON g.awayTeamId = at.team_id
                JOIN Seasons s ON g.seasonId = s.season_id
            ORDER BY
                g.gameDate DESC;
        `;

        const games = await this.dataSource.query(query);
        return games;
    }

    mapLeague(apiLeagueId: number): { id: number; name: string; kr_name: string } {
        return this.leagueMapping[apiLeagueId] || null;
    }

    mapTeam(apiTeamId: number): { id: number; name: string; kr_name: string } {
        return this.teamMapping[apiTeamId] || null;
    }

    brt7mMapLeague(apiLeagueId: number): { id: number; name: string; kr_name: string } {
        return this.bet7mLeagueMapping[apiLeagueId] || null;
    }

    brt7mMapTeam(apiTeamId: number): { id: number; name: string; kr_name: string } {
        return this.bet7mTeamMapping[apiTeamId] || null;
    }

    async get7mData() {
        const now = new Date();
        const unixTimestamp = Math.floor(now.getTime() / 1000);

        console.log(unixTimestamp)

        let reqData;
    
        await axios.get(`https://bab.7mkr.com/Data/kr.xml?${unixTimestamp}}`)
            .then((res) => {
                reqData = res.data;

                console.log(reqData)
            });
    
        const parser = new xml2js.Parser();
        
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        try {
            const result = await parser.parseStringPromise(reqData);
            const games = result.r.c;
            const gameData = games.slice(1); // 첫 번째 데이터를 제외한 나머지 데이터
    
            await Promise.all(gameData.map(async (game) => {
                const gameDetails = game; // CDATA 섹션 또는 문자열 데이터 추출
    
                // $$로 데이터 분리
                const [mainData, extraData] = gameDetails.split('$$');
                const match = mainData.split(',');
                
                const gameStatusValue = parseInt(match[1], 10);
                let gameStatus;

                // gameStatusValue를 기반으로 상태 설정
                if (gameStatusValue === 0) {
                    gameStatus = "READY";
                } else if (gameStatusValue >= 1 && gameStatusValue <= 22) {
                    gameStatus = "IN-PROGRESS";
                } else if (gameStatusValue === 23) {
                    gameStatus = "FINAL";
                } else if (gameStatusValue === 24) {
                    gameStatus = "FINAL-EXTRA";
                }else {
                    // 취소 연기는 아예 데이터에 안나옴;;;
                    gameStatus = "UNKNOWN"; // 예외적인 경우를 처리하기 위한 기본값
                }

                // 리그 코드 및 팀 이름 추출
                const leagueCode = match[3].replace(/'/g, '');
                const homeTeam = match[8].replace(/'/g, '');
                const awayTeam = match[9].replace(/'/g, '');
                

                // 스코어는 기본 0~9까지 있음 10번째는 토탈 점수임 인덱스 기준 기본 10개 있음
                // 그리고 지금 중요한건 match[1] 현재 이닝수를 뜻함.

                // 연장을 하면 0~10까지 생김

                // ㅇ
                const scoreData = match.slice(13); // 11번째 인덱스부터 스코어가 시작
                const midIndex = Math.floor(scoreData.length / 2);

                const awayScores = scoreData.slice(0, midIndex);
                const homeScores = scoreData.slice(midIndex);
                
                if (!this.bet7mLeagueMapping[leagueCode]) return;
                const homeTeamId = extraData.split(',')[2].trim().replace(/'/g, ''); // 홈 팀 ID
                const awayTeamId = extraData.split(',')[1].trim().replace(/'/g, ''); // 어웨이 팀 ID
                
                const homeTeamInfo = this.bet7mTeamMapping[homeTeamId];
                const awayTeamInfo = this.bet7mTeamMapping[awayTeamId];

                if (homeTeamInfo && awayTeamInfo) {
                    const league = this.brt7mMapLeague(leagueCode);

                    const year = match[5].replace(/'/g, '');
                    const month = match[6].replace(/'/g, '').padStart(2, '0');  // 월을 두 자리로 맞춤
                    const day = match[7].replace(/'/g, '').padStart(2, '0');    // 일을 두 자리로 맞춤
                    const hour = match[8].replace(/'/g, '').padStart(2, '0');   // 시를 두 자리로 맞춤
                    const minute = match[9].replace(/'/g, '').padStart(2, '0'); // 분을 두 자리로 맞춤
                    const second = '00';  // 초는 없으므로 '00'으로 설정

                    // 날짜 문자열 생성
                    const dateTimeString = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

                    // Date 객체로 변환
                    const gameDate = new Date(dateTimeString);

                    let season = await queryRunner.manager.getRepository(Seasons).findOne({
                        where: {
                            leagueId: league.id,
                            year: gameDate.getFullYear()
                        },
                        select: ['seasonId']
                    });
    
                    let existingGame = await queryRunner.manager.getRepository(Games).findOne({
                        where: {
                            seasonId: season.seasonId,
                            homeTeamId: homeTeamInfo.id,
                            awayTeamId: awayTeamInfo.id,
                            gameDate: gameDate
                        },
                        select: ['gameId']
                    });

                    if (existingGame && existingGame.gameId) {
                        // 숫자만 계산하고, 문자열은 무시
                        const homeScoreSum = homeScores.reduce((sum, score) => sum + (isNaN(parseInt(score, 10)) ? 0 : parseInt(score, 10)), 0);
                        const awayScoreSum = awayScores.reduce((sum, score) => sum + (isNaN(parseInt(score, 10)) ? 0 : parseInt(score, 10)), 0);
                    
                        existingGame.homeScore = homeScoreSum;
                        existingGame.awayScore = awayScoreSum;
                        existingGame.gameStatus = gameStatus;
                    
                        await queryRunner.manager.getRepository(Games).save(existingGame);
                        await queryRunner.manager.getRepository(Periods).delete({ gameId: existingGame.gameId });
                    } else {
                        // 숫자만 계산하고, 문자열은 무시
                        const homeScoreSum = homeScores.reduce((sum, score) => sum + (isNaN(parseInt(score, 10)) ? 0 : parseInt(score, 10)), 0);
                        const awayScoreSum = awayScores.reduce((sum, score) => sum + (isNaN(parseInt(score, 10)) ? 0 : parseInt(score, 10)), 0);
                    
                        const gameInfo = {
                            seasonId: season.seasonId,
                            homeTeamId: homeTeamInfo.id,
                            awayTeamId: awayTeamInfo.id,
                            gameDate: gameDate,
                            homeScore: homeScoreSum,
                            awayScore: awayScoreSum,
                            gameStatus: gameStatus,
                        };

                        existingGame = await queryRunner.manager.getRepository(Games).save(gameInfo);
                    }
                    
                    for (let i = 0; i < homeScores.length; i++) {
                        // 숫자만 처리하고, 문자열은 무시
                        const homeScore = isNaN(parseInt(homeScores[i], 10)) ? 0 : parseInt(homeScores[i], 10);
                        const awayScore = isNaN(parseInt(awayScores[i], 10)) ? 0 : parseInt(awayScores[i], 10);
                    
                        const periodEntity = {
                            gameId: existingGame.gameId,
                            periodNumber: i + 1,
                            homeTeamScore: homeScore,
                            awayTeamScore: awayScore,
                        };
                    
                        await queryRunner.manager.getRepository(Periods).save(periodEntity);
                    }
                }
            }));
    
            await queryRunner.commitTransaction();
        } catch (error) {
            console.error(error);
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
    
    // async get7mDataTest() {


    //     // const axiosConfig = {
    //     //     headers: {
    //     //         'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    //     //         'accept-encoding': 'gzip, deflate, br, zstd',
    //     //         'accept-language': 'en-US,en;q=0.9,ko;q=0.8',
    //     //         'cache-control': 'max-age=0',
    //     //         'cookie': '_ga=GA1.1.2058133518.1722049133; ASP.NET_SessionId=adxzas550yfskdylv40xiyn4; BaseBall_Rst=6; _ga_ZWGG4ELP43=GS1.1.1723200207.10.1.1723200209.0.0.0',
    //     //         'if-modified-since': 'Fri, 09 Aug 2024 10:49:58 GMT',
    //     //         'if-none-match': 'W/"3a7a1e049eada1:0"',
    //     //         'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
    //     //         'sec-ch-ua-mobile': '?0',
    //     //         'sec-ch-ua-platform': '"Windows"',
    //     //         'sec-fetch-dest': 'document',
    //     //         'sec-fetch-mode': 'navigate',
    //     //         'sec-fetch-site': 'none',
    //     //         'sec-fetch-user': '?1',
    //     //         'upgrade-insecure-requests': '1',
    //     //         'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
    //     //     }
    //     // };

    //     const now = new Date();
    //     const unixTimestamp = Math.floor(now.getTime() / 1000);
    //     let reqData;
    
    //     // 최초 전체 데이터를 요청
    //     await axios.get(`https://bab.7mkr.com/Data/kr.xml?1723202299`)
    //         .then((res) => {
    //             reqData = res.data;
    //             console.log("Initial Data:", reqData);
    //         });
    
    //     const parser = new xml2js.Parser();
        
    //     const queryRunner = this.dataSource.createQueryRunner();
    //     await queryRunner.connect();
    //     await queryRunner.startTransaction();
    
    //     try {
    //         const result = await parser.parseStringPromise(reqData);
    //         const games = result.r.c;
    //         const gameData = games.slice(1); // 첫 번째 데이터를 제외한 나머지 데이터
    
    //         await Promise.all(gameData.map(async (game) => {
    //             const gameDetails = game; // CDATA 섹션 또는 문자열 데이터 추출
    
    //             // $$로 데이터 분리
    //             const [mainData, extraData] = gameDetails.split('$$');
    //             const match = mainData.split(',');
    
    //             // 여기에 기존의 데이터 처리 로직이 들어갑니다
    //             // 예: gameStatus, leagueCode, homeTeam, awayTeam 등 추출 후 처리
    
    //         }));
    
    //         await queryRunner.commitTransaction();
    
    //         // 일정 시간 간격으로 변경된 데이터를 요청
    //         setInterval(async () => {
    //             try {
    //                 let changeData;
    
    //                 // 변경된 데이터 요청
    //                 await axios.get(`https://bab.7mkr.com/ChangeData/change.xml?${unixTimestamp}`)
    //                     .then((res) => {
    //                         changeData = res.data;
    //                         console.log("Change Data:", changeData);
    //                     });
    
    //                 const changeResult = await parser.parseStringPromise(changeData);
    //                 const changeGames = changeResult.r.c;
    //                 const changeGameData = changeGames.slice(1); // 첫 번째 데이터를 제외한 나머지 데이터
    
    //                 await Promise.all(changeGameData.map(async (game) => {
    //                     const gameDetails = game; // CDATA 섹션 또는 문자열 데이터 추출
    
    //                     // $$로 데이터 분리
    //                     const [mainData, extraData] = gameDetails.split('$$');
    //                     const match = mainData.split(',');
    
    //                     // 여기에 변경된 데이터 처리 로직이 들어갑니다
    
    //                 }));
    
    //                 await queryRunner.commitTransaction();
    //             } catch (error) {
    //                 console.error("Error during change data handling:", error);
    //                 await queryRunner.rollbackTransaction();
    //             }
    //         }, 2000); // 2초마다 변경된 데이터를 요청
    
    //     } catch (error) {
    //         console.error(error);
    //         await queryRunner.rollbackTransaction();
    //         throw error;
    //     } finally {
    //         await queryRunner.release();
    //     }
    // }
    
}

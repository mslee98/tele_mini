import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { DataSource, Repository } from 'typeorm';
import dataSource from 'database.providers';

@Injectable()
export class AppService {
  constructor(
    private dataSource: DataSource
  ) {}
  
  getHello(): string {
    return 'Hello World!';
  }

  // async dataSort(data: any) {

  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {

  //     await queryRunner.manager.getRepository(NamedJson).save({
  //       "data": JSON.stringify(data)
  //     });


  //     for (const gameData of data) {
  //       await queryRunner.manager.getRepository(Match).save({
  //         "data": JSON.stringify(gameData)
  //       });
  //     }

  //     await queryRunner.commitTransaction();


  //   } catch(error) {
  //     console.error(error);
  //     await queryRunner.rollbackTransaction();
  //     throw error;
  //   } finally {
  //     await queryRunner.release();

  //   }

  //   return data;
  // }

}

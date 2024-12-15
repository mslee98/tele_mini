import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateTeleUserDto } from './dto/createTeleUserDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    
    constructor(
        
        @InjectRepository(Users)
        private teleUserRepository: Repository<Users>,

        private dataSource : DataSource
    ) {

    }

    async telUserInfo(telUserId: string) {

        const returned = await this.teleUserRepository
                .findOne({
                    where: { teleId: telUserId },
                    select: ['id', 'teleId', 'firstName', 'lastName', 'money', 'visitCount']
                })

        return returned;
    }


    async postUsers(email: string, nickname: string, password: string, firstName: string, lastName:string ) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const user = await queryRunner.manager.getRepository(Users).findOne({where: {email}})

        if(user) {
            //throw는 return 기능도 수행함 
            throw new UnauthorizedException('이미 존재하는 User입니다.');
        } 
        
        console.log(`${email} / ${nickname} / ${password} / ${firstName} / ${lastName}`)

        const hashedPassword = await bcrypt.hash(password, 12);
        
        try {
            const returned = await queryRunner.manager.getRepository(Users).save({
            firstName,
            lastName,
            email,
            nickname,
            password: hashedPassword
            });

            await queryRunner.commitTransaction();
            return true;

        } catch(error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    // async getUserInfo(username: string) {
    //     return this.teleUserRepository.find((user => user.username === username))
    // }

    async userCheck(user_id, first_name, last_name) {

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect()
        await queryRunner.startTransaction();

        let returned;

        try {

            returned = await queryRunner.manager
                .getRepository(Users)
                .findOne({ where: { teleId: user_id } });

            console.log("returned : ",returned)

            if(!returned) {
                await queryRunner.manager.getRepository(Users).save({
                    "teleId": user_id,
                    "firstName": first_name,
                    "lastName": last_name,
                    "money": 10000,
                });
            } 

            await queryRunner.commitTransaction();
        } catch(error) {
            console.error(error);
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }

    return returned;

    }

    async postMoney(id: number, money: number) {
        
        const qureyRunner = this.dataSource.createQueryRunner();
        await qureyRunner.connect()
        await qureyRunner.startTransaction();

        try {

            await qureyRunner.manager.getRepository(Users).update(
                { id: id },
                { money: money },
            )

            await qureyRunner.commitTransaction();
        } catch (error) {
            await qureyRunner.rollbackTransaction();
        } finally {
            await qureyRunner.release();
        }

    }
}

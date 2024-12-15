import { Body, Controller, Get } from '@nestjs/common';
import { NamedService } from './named.service';

@Controller('data')
export class NamedController {
    constructor(
        private namedService: NamedService
    ) {}

    @Get('/named')
    postNamedData(@Body('date') date?: string) {

        let formattedDate: string;

        if (date) {
        // 쿼리 파라미터로 받은 날짜 사용
        formattedDate = date;
        } else {
        // 쿼리 파라미터가 없을 경우 오늘 날짜 사용
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 필요
        const dd = String(today.getDate()).padStart(2, '0'); // 일자를 두 자리로 맞추기 위해 padStart 사용

        formattedDate = `${yyyy}-${mm}-${dd}`;
        }

        console.log(`Using date: ${formattedDate}`); // 사용할 날짜를 로그로 출력

        return this.namedService.saveNamedData(formattedDate); 
    }

    @Get('/7m')
    get7mData() {
        return this.namedService.get7mData();
    }
}

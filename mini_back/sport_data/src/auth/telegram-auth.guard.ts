import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


@Injectable()
export class TelegramAuthGuard extends AuthGuard('telegram') {

    async canActivate(context: ExecutionContext) {
        const result = (await super.canActivate(context)) as boolean;
    
        // 이후 추가적인 검증 로직이 필요하면 여기서 처리 가능
        const request = context.switchToHttp().getRequest();
        console.log("Authenticated user:", request.user); // 여기서 req.user가 올바르게 설정되는지 확인

        if (result) {
            // 사용자 객체를 세션에 저장
            await super.logIn(request);
        }
      
        console.log("Authenticated user:", request.user); // 여전히 undefined인지 확인
      
        return true;
    
      }

    // async canActivate(context: ExecutionContext): Promise<boolean> {
    //     console.log("@@@@@@@@@@@@@@@@@@@@@@")

    //     const can = await super.canActivate(context);

    //     if(can) {
    //         const request = context.switchToHttp().getRequest();
    //         console.log('login for cookie');
    //         await super.logIn(request)
    //     }

    //     return true
    // }
}

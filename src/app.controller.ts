import {Controller, Get} from '@nestjs/common';

import {AppService} from './app.service';
import {AppLogger} from './shared/logger/logger.service';
import {ReqContext} from './shared/request-context/req-context.decorator';
import {RequestContext} from './shared/request-context/request-context.dto';

@Controller()
export class AppController {
  constructor(
    private readonly logger: AppLogger,
    private readonly appService: AppService,
  ) {
  }

  @Get('health-check')
  getHello(@ReqContext() ctx: RequestContext): string {
    return this.appService.getHello(ctx);
  }

  @Get()
  index() {
    return (`
      <div style="text-align: center">
        <h1>Bình tĩnh bro 🚀</h1>
        <p>Chắc hẳn bạn thấy ngạc nhiên lắm khi thấy cái site láo nháo như này. Nhưng mà bình tĩnh, tôi chưa có thời gian, khi nào rảnh sẽ làm :))</p>
        <img src="https://i.kym-cdn.com/photos/images/original/002/051/163/11a.gif">
      </div>
    `);
  }
}

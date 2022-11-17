import {Injectable, Logger} from '@nestjs/common';
import {EventPatternDto} from "../shared/dtos/event-partten.dto";


@Injectable()
export class SaleorSubscriberService {
  async handleEvent(data: EventPatternDto){
    Logger.log(data)
  }
}

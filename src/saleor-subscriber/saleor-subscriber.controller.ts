import {Controller} from '@nestjs/common'
import {EventPattern} from "@nestjs/microservices";
import {EventPatternDto} from "../shared/dtos/event-partten.dto";
import {SaleorSubscriberService} from "./saleor-subscriber.service";
import {SALEOR_EVENT_PATTERN} from "../shared/constants";

@Controller()
export class SaleorSubscriberController {
  constructor(private readonly saleorSubscriptionService: SaleorSubscriberService) {
  }

  @EventPattern(SALEOR_EVENT_PATTERN)
  async handleEvent(data: EventPatternDto){
    await this.saleorSubscriptionService.handleEvent(data)
  }
}

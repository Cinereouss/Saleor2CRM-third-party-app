import { Module } from '@nestjs/common';

import {SaleorSubscriberModule} from "./saleor-subscriber/saleor-subscriber.module";

@Module({
  imports: [SaleorSubscriberModule],
  controllers: [],
  providers: [],
})
export class AppSubscriberModule {}

import { Module } from '@nestjs/common';
import { SaleorSubscriberService } from './saleor-subscriber.service';
import { SaleorSubscriberController } from './saleor-subscriber.controller';
import {ConfigService} from "@nestjs/config";

@Module({
  controllers: [SaleorSubscriberController],
  providers: [SaleorSubscriberService, ConfigService]
})
export class SaleorSubscriberModule {}

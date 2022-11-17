import { Module } from '@nestjs/common';
import { SaleorPublisherService } from './saleor-publisher.service';
import { SaleorPublisherController } from './saleor-publisher.controller';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ClientsModule} from "@nestjs/microservices";
import {HANDLE_SALEOR_EVENT_SERVICE} from "../shared/constants";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: HANDLE_SALEOR_EVENT_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => config.get('rabbitmq_config')!,
      }
    ])
  ],
  controllers: [SaleorPublisherController],
  providers: [SaleorPublisherService, ConfigService]
})
export class SaleorPublisherModule {}

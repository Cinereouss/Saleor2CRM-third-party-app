import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { SaleorPublisherModule } from './saleor-publisher/saleor-publisher.module';

@Module({
  imports: [SharedModule, SaleorPublisherModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

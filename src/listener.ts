import { NestFactory } from '@nestjs/core';

import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {AppSubscriberModule} from "./app-subscriber.module";
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppSubscriberModule);
  const configService = app.get(ConfigService);
  const rabbitmqConfig = configService.get('rabbitmq_config');

  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppSubscriberModule, rabbitmqConfig)
  await microservice.listen()
}
bootstrap();

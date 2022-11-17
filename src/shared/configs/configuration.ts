import {Transport} from "@nestjs/microservices";

export default (): any => ({
  env: process.env.APP_ENV,
  port: process.env.APP_PORT,
  app_prefix: process.env.APP_PREFIX,
  app_domain: process.env.APP_DOMAIN,
  public_saleor_api_url: process.env.PUBLIC_SALEOR_API_URL,
  public_saleor_api_token: process.env.PUBLIC_SALEOR_API_TOKEN,
  rabbitmq_config: {
    transport: Transport.RMQ,
    options: {
      urls: [...process.env.RABBITMQ_URLS.split(',')],
      queue: process.env.RABBITMQ_QUEUE_NAME,
      queueOptions: {
        durable: false
      },
    }
  },
});

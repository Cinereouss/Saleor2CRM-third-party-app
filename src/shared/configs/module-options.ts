import * as Joi from '@hapi/joi';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';

import configuration from './configuration';

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: '.env',
  load: [configuration],
  validationSchema: Joi.object({
    APP_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    APP_PORT: Joi.number().required(),
    APP_PREFIX: Joi.string().required(),
    APP_DOMAIN: Joi.string().required(),
    PUBLIC_SALEOR_API_URL: Joi.string().required(),
    PUBLIC_SALEOR_API_TOKEN: Joi.string().allow(null),
    RABBITMQ_URLS: Joi.string().allow(null),
    RABBITMQ_QUEUE_NAME: Joi.string().allow(null),
  }),
};

import { SetMetadata } from '@nestjs/common';
import {DOMAIN_VALIDATE, SALEOR_DOMAIN_VALIDATE} from "../constants";

export const DomainValid = () =>
  SetMetadata(SALEOR_DOMAIN_VALIDATE, DOMAIN_VALIDATE);


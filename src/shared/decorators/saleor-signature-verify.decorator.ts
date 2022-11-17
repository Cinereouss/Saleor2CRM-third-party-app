import { SetMetadata } from '@nestjs/common';
import {DOMAIN_VALIDATE, SALEOR_DOMAIN_VALIDATE, SALEOR_SIGNATURE_VALIDATE, SIGNATURE_VALID} from "../constants";

export const SignatureValid = () =>
  SetMetadata(SALEOR_SIGNATURE_VALIDATE, SIGNATURE_VALID);


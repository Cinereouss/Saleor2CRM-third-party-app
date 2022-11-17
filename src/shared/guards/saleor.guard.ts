import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {SALEOR_DOMAIN_VALIDATE, SALEOR_SIGNATURE_VALIDATE} from "../constants";
import {ConfigService} from "@nestjs/config";
import {SALEOR_SIGNATURE_HEADER, SALEOR_DOMAIN_HEADER} from "@saleor/app-sdk/const";
import {SaleorPublisherService} from "../../saleor-publisher/saleor-publisher.service";
import * as url from "url";

@Injectable()
export class SaleorGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly saleorService: SaleorPublisherService
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const checkDomainValidate =
      this.reflector.get<string[]>(SALEOR_DOMAIN_VALIDATE, context.getHandler()) || [];

    if(checkDomainValidate.length > 0){
      const appDomain = url.parse(this.configService.get<string>('public_saleor_api_url')).host
      const saleorDomain = request.headers[SALEOR_DOMAIN_HEADER];

      if (!saleorDomain) {
        throw new BadRequestException({
          message: "Missing saleor domain token."
        })
      }
      if (appDomain !== saleorDomain) {
        throw new BadRequestException({
          message: "Saleor domain doesn't match configured PUBLIC_SALEOR_API_URL domain",
        })
      }
    }

    const checkSignatureValidate =
      this.reflector.get<string[]>(SALEOR_SIGNATURE_VALIDATE, context.getHandler()) || [];
    if(checkSignatureValidate.length > 0) {
      const jws = request.headers[SALEOR_SIGNATURE_HEADER];
      const [header, _, signature] = jws.split(".");

      try {
        /**
         * Configure webhooks, using raw body
         * await NestFactory.create(AppModule, {rawBody: true});
         */
        await this.saleorService.verifySignatureSaleor(header, request.rawBody.toString('utf-8'), signature)
      } catch (e) {
        throw new BadRequestException("Invalid signature")
      }
    }

    return request;
  }
}

import {Controller, Get, Post, RawBodyRequest, Req, UseGuards} from '@nestjs/common';
import {AppManifest} from "@saleor/app-sdk/types";
import { Request } from 'express';

import {ReqContext} from "../shared/request-context/req-context.decorator";
import {RequestContext} from "../shared/request-context/request-context.dto";
import { SaleorPublisherService } from './saleor-publisher.service';
import {DomainValid} from "../shared/decorators/saleor-domain-verify.decorator";
import {SaleorGuard} from "../shared/guards/saleor.guard";
import {SignatureValid} from "../shared/decorators/saleor-signature-verify.decorator";


@UseGuards(SaleorGuard)
@Controller('saleor')
export class SaleorPublisherController {
  constructor(private readonly saleorService: SaleorPublisherService) {}

  @Get('manifest')
  getManifest(@ReqContext() ctx: RequestContext): AppManifest {
    return this.saleorService.getManifest(ctx);
  }

  @DomainValid()
  @Post('register')
  register(@ReqContext() ctx: RequestContext, @Req() request: Request) {
    return this.saleorService.handleRegister(ctx, request);
  }

  @DomainValid()
  @SignatureValid()
  @Post('webhooks')
  webhook(@ReqContext() ctx: RequestContext, @Req() request: Request, @Req() rawRequest: RawBodyRequest<Request>) {
    return this.saleorService.handleWebhook(ctx, request);
  }
}

import {BadRequestException, Inject, Injectable, Logger} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {AppManifest} from "@saleor/app-sdk/types";
import {Request} from 'express';
import * as fs from 'fs';

import {RequestContext} from "../shared/request-context/request-context.dto";
import * as Path from "path";
import {SALEOR_PERMISSION, SALEOR_ASYNC_EVENT} from "../shared/constants/saleor-constant";
import * as jose from "jose"
import {GetKeyFunction} from "jose/dist/types/types";
import {FlattenedJWSInput, JWSHeaderParameters} from "jose";
import {SALEOR_EVENT_HEADER} from "@saleor/app-sdk/const";
import {ClientProxy} from "@nestjs/microservices";
import {HANDLE_SALEOR_EVENT_SERVICE, SALEOR_EVENT_PATTERN} from "../shared/constants";
import {EventPatternDto} from "../shared/dtos/event-partten.dto";

@Injectable()
export class SaleorPublisherService {
  private readonly JWKS

  constructor(
    private readonly configService: ConfigService,
    @Inject(HANDLE_SALEOR_EVENT_SERVICE) private readonly queueClient: ClientProxy
  ) {
    const saleorDoamin = this.configService.get<string>('public_saleor_api_url')
    this.JWKS = jose.createRemoteJWKSet(
      new URL(Path.join(saleorDoamin, "/.well-known/jwks.json").replace(':/', '://'))
    );
  }

  getJWKS(): GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput> {
    return this.JWKS
  }

  private maskToken(token: string) {
    return "*".repeat(Math.max(token.length - 4, 0)) + token.slice(-4);
  }

  getAuthToken() {
    let token;
    const appToken = this.configService.get<string>("public_saleor_api_token")
    token = appToken || ""

    if (fs.existsSync(".auth_token")) {
      token = fs.readFileSync(".auth_token", "utf-8").trim();
    }

    if (!token) {
      console.warn(
        "⚠️ Warning! Auth token is not set. Make sure the app is installed in Saleor or set SALEOR_APP_TOKEN environment variable"
      );
      token = "";
    }

    return token;
  };

  saveAuthToken(token: string) {
    console.log("Setting authToken: ", this.maskToken(token));
    fs.writeFileSync(".auth_token", token);
  };

  async verifySignatureSaleor(header: string, payload: string, signature: string) {
    await jose.flattenedVerify({
      protected: header,
      payload: payload,
      signature: signature
    }, this.getJWKS());
  }

  getManifest(ctx: RequestContext): AppManifest {
    const appBaseURL = new URL(Path.join(this.configService.get<string>('app_domain'), this.configService.get<string>('app_prefix')).replace(':/', '://'))

    const manifest: AppManifest = {
      name: "Uni Shopping to CRM",
      tokenTargetUrl: new URL(Path.join(appBaseURL.toString(), 'saleor/register').replace(':/', '://')).toString(),
      appUrl: appBaseURL.toString(),
      permissions: [
        /**
         * Set permissions for app if needed
         * https://docs.saleor.io/docs/3.x/developer/permissions
         */
        SALEOR_PERMISSION.MANAGE_APPS,
        SALEOR_PERMISSION.MANAGE_PRODUCTS

      ],
      id: "saleor.app",
      version: "1.0.0",
      webhooks: [
        /**
         * Configure webhooks here. They will be created in Saleor during installation
         * Read more
         * https://docs.saleor.io/docs/3.x/developer/api-reference/objects/webhook
         */
        {
          "name": "Update product notifications",
          "asyncEvents": [
            SALEOR_ASYNC_EVENT.PRODUCT_UPDATED.toUpperCase()
          ],
          "query": "subscription { event { ... on ProductUpdated { product { id name } } } }",
          "targetUrl":  new URL(Path.join(appBaseURL.toString(), 'saleor/webhooks').replace(':/', '://')).toString(),
        },
      ],
      extensions: [
        /**
         * Optionally, extend Dashboard with custom UIs
         * https://docs.saleor.io/docs/3.x/developer/extending/apps/extending-dashboard-with-apps
         */
      ],
    };

    return manifest;
  }

  handleRegister(ctx: RequestContext, request: Request) {
    const {auth_token} = request.body;
    if (!auth_token) {
      throw new BadRequestException({
        message: "Missing auth token.",
      })
    }

    this.saveAuthToken(auth_token)

    return {
      success: true
    }
  }

  handleWebhook(ctx: RequestContext, request: Request) {
    /***
     * Handle something in here. Ex: modify body data
    */
    this.emitEvent(request.headers[SALEOR_EVENT_HEADER] as string, request.body)
  }

  emitEvent(event: string, data: any){
    const emitData: EventPatternDto = {
      event: event,
      data: data
    }

    try {
      this.queueClient.emit(SALEOR_EVENT_PATTERN, emitData)
      Logger.warn(`Event ${event} emitted!`)
    }catch(e) {
      Logger.error(e)
    }
  }
}

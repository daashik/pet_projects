import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import UserRoles from 'supertokens-node/recipe/userroles';
import { AuthModuleConfig } from './auth.module';

@Injectable()
export class SupertokensService {
  constructor(@Inject('SUPERTOKENS_CONFIG') private config: AuthModuleConfig) {
    supertokens.init({
      framework: 'express',
      supertokens: {
        connectionURI: config.connectionUri,
        apiKey: config.apiKey,
      },
      appInfo: {
        appName: config.appName,
        apiDomain: config.apiDomain,
        websiteDomain: config.websiteDomain,
        apiBasePath: '/auth',
        websiteBasePath: '/auth',
      },
      recipeList: [
        EmailPassword.init(),
        Session.init({
            cookieSecure: false,
            getTokenTransferMethod: () => 'cookie',
        }),
        UserRoles.init(),
      ],
    });
  }
}
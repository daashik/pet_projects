import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { SupertokensService } from './supertokens.service';

export interface AuthModuleConfig {
  connectionUri: string;
  apiKey: string;
  appName: string;
  websiteDomain: string;
  apiDomain: string;
}

@Module({})
export class AuthModule {
  static forRoot(config: AuthModuleConfig): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        {
          provide: 'SUPERTOKENS_CONFIG',
          useValue: config,
        },
        SupertokensService,
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
      ],
      exports: [SupertokensService],
      global: true,
    };
  }
}
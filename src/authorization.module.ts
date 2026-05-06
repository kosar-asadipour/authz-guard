import { DynamicModule, Global, Module } from '@nestjs/common';
import { AuthorizationGuard } from './authorization.guard.js';
import { casbinProvider, ENFORCER } from './casbin.provider.js';
import {Reflector} from "@nestjs/core";
import { Enforcer } from 'casbin';

@Global()
@Module({
  providers: [Reflector, Enforcer],
  exports: [Reflector, ENFORCER],
})

export class AuthorizationModule {
  static forRootAsync(options: {
      imports?: any[];
      useFactory: (...args: any[]) => Promise<any> | any;
      inject?: any[];
    }): DynamicModule {

    return {
      module: AuthorizationModule,
      imports:options.imports || [],
      providers: [
        {
          provide: 'CASBIN_ADAPTER',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        casbinProvider,
        AuthorizationGuard,
      ],
    };
  }
}
import { DynamicModule, Module } from '@nestjs/common';
import { AuthorizationGuard } from './authorization.guard.js';
import { casbinProvider, ENFORCER } from './casbin.provider.js';
import {Reflector} from "@nestjs/core";
import { Enforcer } from 'casbin';
@Module({
  providers: [AuthorizationGuard, Reflector,  Enforcer],
  exports: [AuthorizationGuard, Reflector,  Enforcer],
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
      exports: [AuthorizationGuard, ENFORCER],
    };
  }
}
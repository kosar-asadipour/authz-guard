import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_SKIP_AUTHZ_KEY } from './skip-authz.decorator.js';
import { Enforcer } from 'casbin';
import {PERMISSION_KEY} from "./permission.decorator.js";
import {ENFORCER} from "./casbin.provider.js";

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(ENFORCER) private enforcer: Enforcer
  ) {}

  async canActivate(context: ExecutionContext) {
    /** 1. Check Public Route */
    const isSkipAuthz = this.reflector.getAllAndOverride<boolean>(IS_SKIP_AUTHZ_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isSkipAuthz) {
      return true;
    }
    /**2. Check if the user has the required permission for the route */
    const permission = this.reflector.get(PERMISSION_KEY, context.getHandler());
    if (!permission) return false;

    const request = context.switchToHttp().getRequest();
    /**EXAMPLE
     request.user = {
       userId: "10cc3340-7d3e-4cf2-a052-bb948e776686",
       userRole: "admin"
     }*/
    const user = request.user;
    if (!user) {
      return false;
    }

    return this.enforcer.enforce(
      user,
      permission.path,
      permission.method,
    )
  }
}

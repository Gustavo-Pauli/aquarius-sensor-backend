import { Reflector } from '@nestjs/core';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { getSession } from 'better-auth/api';
import type { Auth } from 'better-auth/auth';
export type UserSession = NonNullable<Awaited<ReturnType<ReturnType<typeof getSession>>>>;
export declare class AuthGuard implements CanActivate {
    private readonly reflector;
    private readonly auth;
    constructor(reflector: Reflector, auth: Auth);
    canActivate(context: ExecutionContext): Promise<boolean>;
}

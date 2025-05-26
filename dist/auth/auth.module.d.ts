import type { MiddlewareConsumer, NestModule, OnModuleInit, Provider } from '@nestjs/common';
import { DiscoveryService, HttpAdapterHost, MetadataScanner } from '@nestjs/core';
import { AuthService } from './auth.service';
import { type Auth } from 'better-auth';
type AuthModuleOptions = {
    disableExceptionFilter?: boolean;
    disableTrustedOriginsCors?: boolean;
    disableBodyParser?: boolean;
};
export declare class AuthModule implements NestModule, OnModuleInit {
    private readonly auth;
    private discoveryService;
    private metadataScanner;
    private readonly adapter;
    private readonly options;
    private logger;
    constructor(auth: Auth, discoveryService: DiscoveryService, metadataScanner: MetadataScanner, adapter: HttpAdapterHost, options: AuthModuleOptions);
    onModuleInit(): void;
    configure(consumer: MiddlewareConsumer): void;
    private setupHooks;
    static forRoot(options?: AuthModuleOptions): {
        global: boolean;
        module: typeof AuthModule;
        providers: Provider[];
        exports: (symbol | typeof AuthService)[];
    };
}
export {};

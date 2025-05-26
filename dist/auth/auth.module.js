"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const plugins_1 = require("better-auth/plugins");
const node_1 = require("better-auth/node");
const auth_service_1 = require("./auth.service");
const symbols_1 = require("./symbols");
const api_error_exception_filter_1 = require("./api-error-exception-filter");
const middlewares_1 = require("./middlewares");
const better_auth_1 = require("better-auth");
const mongodb_1 = require("mongodb");
const mongodb_2 = require("better-auth/adapters/mongodb");
const config_1 = require("@nestjs/config");
const HOOKS = [
    { metadataKey: symbols_1.BEFORE_HOOK_KEY, hookType: 'before' },
    { metadataKey: symbols_1.AFTER_HOOK_KEY, hookType: 'after' },
];
const isProd = process.env.NODE_ENV === 'production';
let AuthModule = AuthModule_1 = class AuthModule {
    auth;
    discoveryService;
    metadataScanner;
    adapter;
    options;
    logger = new common_1.Logger(AuthModule_1.name);
    constructor(auth, discoveryService, metadataScanner, adapter, options) {
        this.auth = auth;
        this.discoveryService = discoveryService;
        this.metadataScanner = metadataScanner;
        this.adapter = adapter;
        this.options = options;
    }
    onModuleInit() {
        if (!this.auth.options.hooks)
            return;
        const providers = this.discoveryService
            .getProviders()
            .filter(({ metatype }) => metatype && Reflect.getMetadata(symbols_1.HOOK_KEY, metatype));
        for (const provider of providers) {
            const providerPrototype = Object.getPrototypeOf(provider.instance);
            const methods = this.metadataScanner.getAllMethodNames(providerPrototype);
            for (const method of methods) {
                const providerMethod = providerPrototype[method];
                this.setupHooks(providerMethod);
            }
        }
    }
    configure(consumer) {
        const trustedOrigins = this.auth.options.trustedOrigins;
        const isNotFunctionBased = trustedOrigins && Array.isArray(trustedOrigins);
        if (!this.options.disableTrustedOriginsCors && isNotFunctionBased) {
            this.adapter.httpAdapter.enableCors({
                origin: trustedOrigins,
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
                credentials: true,
            });
        }
        else if (trustedOrigins &&
            !this.options.disableTrustedOriginsCors &&
            !isNotFunctionBased)
            throw new Error('Function-based trustedOrigins not supported in NestJS. Use string array or disable CORS with disableTrustedOriginsCors: true.');
        if (!this.options.disableBodyParser) {
            consumer.apply(middlewares_1.SkipBodyParsingMiddleware).forRoutes('{*path}');
        }
        let basePath = this.auth.options.basePath ?? '/api/auth';
        if (!basePath.startsWith('/')) {
            basePath = '/' + basePath;
        }
        if (basePath.endsWith('/')) {
            basePath = basePath.slice(0, -1);
        }
        const handler = (0, node_1.toNodeHandler)(this.auth);
        this.adapter.httpAdapter
            .getInstance()
            .use(`${basePath}/*splat`, (req, res) => {
            req.url = req.originalUrl;
            return handler(req, res);
        });
        this.logger.log(`AuthModule initialized BetterAuth on '${basePath}/*splat'`);
    }
    setupHooks(providerMethod) {
        if (!this.auth.options.hooks)
            return;
        for (const { metadataKey, hookType } of HOOKS) {
            const hookPath = Reflect.getMetadata(metadataKey, providerMethod);
            if (!hookPath)
                continue;
            const originalHook = this.auth.options.hooks[hookType];
            this.auth.options.hooks[hookType] = (0, plugins_1.createAuthMiddleware)(async (ctx) => {
                if (originalHook) {
                    await originalHook(ctx);
                }
                if (hookPath === ctx.path) {
                    await providerMethod(ctx);
                }
            });
        }
    }
    static forRoot(options = {}) {
        const providers = [
            {
                provide: symbols_1.AUTH_INSTANCE_KEY,
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const mongoUri = configService.get('MONGO_URI');
                    if (!mongoUri) {
                        throw new Error('MONGO_URI environment variable is not defined');
                    }
                    const trustedOriginsEnv = configService.get('TRUSTED_ORIGINS', '');
                    const trustedOrigins = trustedOriginsEnv
                        ? trustedOriginsEnv.split(',')
                        : [];
                    const client = new mongodb_1.MongoClient(mongoUri);
                    const db = client.db();
                    return (0, better_auth_1.betterAuth)({
                        trustedOrigins,
                        database: (0, mongodb_2.mongodbAdapter)(db),
                        emailAndPassword: {
                            enabled: true,
                        },
                        session: {
                            freshAge: 10,
                            modelName: 'sessions',
                        },
                        user: {
                            modelName: 'users',
                            additionalFields: {
                                role: {
                                    type: 'string',
                                    defaultValue: 'user',
                                },
                            },
                        },
                        account: {
                            modelName: 'accounts',
                        },
                        verification: {
                            modelName: 'verifications',
                        },
                        ...(isProd
                            ? {
                                advanced: {
                                    crossSubDomainCookies: {
                                        enabled: true,
                                        domain: configService.get('CROSS_DOMAIN_ORIGIN'),
                                    },
                                    defaultCookieAttributes: {
                                        secure: true,
                                        httpOnly: true,
                                        sameSite: 'none',
                                        partitioned: true,
                                    },
                                },
                            }
                            : {}),
                    });
                },
            },
            {
                provide: symbols_1.AUTH_MODULE_OPTIONS_KEY,
                useValue: options,
            },
            auth_service_1.AuthService,
        ];
        if (!options.disableExceptionFilter) {
            providers.push({
                provide: core_1.APP_FILTER,
                useClass: api_error_exception_filter_1.APIErrorExceptionFilter,
            });
        }
        return {
            global: true,
            module: AuthModule_1,
            providers,
            exports: [symbols_1.AUTH_INSTANCE_KEY, symbols_1.AUTH_MODULE_OPTIONS_KEY, auth_service_1.AuthService],
        };
    }
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = AuthModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [core_1.DiscoveryModule],
    }),
    __param(0, (0, common_1.Inject)(symbols_1.AUTH_INSTANCE_KEY)),
    __param(1, (0, common_1.Inject)(core_1.DiscoveryService)),
    __param(2, (0, common_1.Inject)(core_1.MetadataScanner)),
    __param(3, (0, common_1.Inject)(core_1.HttpAdapterHost)),
    __param(4, (0, common_1.Inject)(symbols_1.AUTH_MODULE_OPTIONS_KEY)),
    __metadata("design:paramtypes", [Object, core_1.DiscoveryService,
        core_1.MetadataScanner,
        core_1.HttpAdapterHost, Object])
], AuthModule);
//# sourceMappingURL=auth.module.js.map
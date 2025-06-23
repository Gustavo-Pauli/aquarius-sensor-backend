import { Global, Inject, Logger, Module } from '@nestjs/common'
import type {
  MiddlewareConsumer,
  NestModule,
  OnModuleInit,
  Provider,
} from '@nestjs/common'
import {
  APP_FILTER,
  DiscoveryModule,
  DiscoveryService,
  MetadataScanner,
} from '@nestjs/core'
import { createAuthMiddleware } from 'better-auth/plugins'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import {
  BEFORE_HOOK_KEY,
  AFTER_HOOK_KEY,
  HOOK_KEY,
  AUTH_INSTANCE_KEY,
  AUTH_MODULE_OPTIONS_KEY,
} from './symbols'
import { APIErrorExceptionFilter } from './api-error-exception-filter'
import { SkipBodyParsingMiddleware } from './middlewares'
import { betterAuth, type Auth } from 'better-auth'
import { MongoClient } from 'mongodb'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { ConfigService } from '@nestjs/config'

/**
 * Configuration options for the AuthModule
 */
type AuthModuleOptions = {
  disableExceptionFilter?: boolean
  disableTrustedOriginsCors?: boolean
  disableBodyParser?: boolean
}

const HOOKS = [
  { metadataKey: BEFORE_HOOK_KEY, hookType: 'before' as const },
  { metadataKey: AFTER_HOOK_KEY, hookType: 'after' as const },
]

const isProd = process.env.NODE_ENV === 'production'

/**
 * NestJS module that integrates the Auth library with NestJS applications.
 * Provides authentication middleware, hooks, and exception handling.
 */
@Global()
@Module({
  imports: [DiscoveryModule],
  controllers: [AuthController],
})
export class AuthModule implements NestModule, OnModuleInit {
  private logger = new Logger(AuthModule.name)
  constructor(
    @Inject(AUTH_INSTANCE_KEY) private readonly auth: Auth,
    @Inject(DiscoveryService)
    private discoveryService: DiscoveryService,
    @Inject(MetadataScanner)
    private metadataScanner: MetadataScanner,
    @Inject(AUTH_MODULE_OPTIONS_KEY)
    private readonly options: AuthModuleOptions
  ) {}

  onModuleInit() {
    // Setup hooks
    if (!this.auth.options.hooks) return

    const providers = this.discoveryService
      .getProviders()
      .filter(
        ({ metatype }) => metatype && Reflect.getMetadata(HOOK_KEY, metatype)
      )

    for (const provider of providers) {
      const providerPrototype = Object.getPrototypeOf(provider.instance)
      const methods = this.metadataScanner.getAllMethodNames(providerPrototype)

      for (const method of methods) {
        const providerMethod = providerPrototype[method]
        this.setupHooks(providerMethod)
      }
    }
  }

  configure(consumer: MiddlewareConsumer) {
    if (!this.options.disableBodyParser) {
      consumer.apply(SkipBodyParsingMiddleware).forRoutes('*')
    }

    this.logger.log('AuthModule initialized with AuthController handling /api/auth/* routes')
  }

  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  private setupHooks(providerMethod: Function) {
    if (!this.auth.options.hooks) return

    for (const { metadataKey, hookType } of HOOKS) {
      const hookPath = Reflect.getMetadata(metadataKey, providerMethod)
      if (!hookPath) continue

      const originalHook = this.auth.options.hooks[hookType]
      this.auth.options.hooks[hookType] = createAuthMiddleware(async ctx => {
        if (originalHook) {
          await originalHook(ctx)
        }

        if (hookPath === ctx.path) {
          await providerMethod(ctx)
        }
      })
    }
  }

  /**
   * Static factory method to create and configure the AuthModule.
   * @param options - Configuration options for the module
   */
  static forRoot(options: AuthModuleOptions = {}) {
    // Force disable ALL CORS in auth module to avoid conflicts with main.ts CORS
    const authOptions = {
      ...options,
      disableTrustedOriginsCors: true, // Completely disable auth module CORS
    }

    const providers: Provider[] = [
      {
        provide: AUTH_INSTANCE_KEY,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const mongoUri = configService.get<string>('MONGO_URI')
          if (!mongoUri) {
            throw new Error('MONGO_URI environment variable is not defined')
          }

          const trustedOriginsEnv = configService.get<string>(
            'TRUSTED_ORIGINS',
            ''
          )
          const trustedOrigins = trustedOriginsEnv
            ? trustedOriginsEnv.split(',')
            : []

          const client = new MongoClient(mongoUri)
          const db = client.db()

          return betterAuth({
            basePath: '/api/auth',
            trustedOrigins,
            database: mongodbAdapter(db),
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
            // cross domain cookies
            ...(isProd
              ? {
                  advanced: {
                    // crossSubDomainCookies: {
                    //   enabled: true,
                    //   domain: configService.get<string>('CROSS_DOMAIN_ORIGIN'),
                    // },
                    defaultCookieAttributes: {
                      secure: false,
                      httpOnly: false,
                      sameSite: 'none',
                      partitioned: true,
                    },
                  },
                }
              : {}),
          })
        },
      },
      {
        provide: AUTH_MODULE_OPTIONS_KEY,
        useValue: authOptions,
      },
      AuthService,
    ]

    if (!authOptions.disableExceptionFilter) {
      providers.push({
        provide: APP_FILTER,
        useClass: APIErrorExceptionFilter,
      })
    }

    return {
      global: true,
      module: AuthModule,
      providers,
      exports: [AUTH_INSTANCE_KEY, AUTH_MODULE_OPTIONS_KEY, AuthService],
    }
  }
}

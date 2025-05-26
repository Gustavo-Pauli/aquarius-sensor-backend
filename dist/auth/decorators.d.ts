import { AFTER_HOOK_KEY, BEFORE_HOOK_KEY, HOOK_KEY } from './symbols';
export declare const Public: () => import("@nestjs/common").CustomDecorator<string>;
export declare const Optional: () => import("@nestjs/common").CustomDecorator<string>;
export declare const Session: (...dataOrPipes: unknown[]) => ParameterDecorator;
export declare const BeforeHook: (path: `/${string}`) => import("@nestjs/common").CustomDecorator<typeof BEFORE_HOOK_KEY>;
export declare const AfterHook: (path: `/${string}`) => import("@nestjs/common").CustomDecorator<typeof AFTER_HOOK_KEY>;
export declare const Hook: () => import("@nestjs/common").CustomDecorator<typeof HOOK_KEY>;

import type { Auth } from 'better-auth/auth';
export declare class AuthService<T extends {
    api: T['api'];
} = Auth> {
    private readonly auth;
    constructor(auth: T);
    get api(): T["api"];
    get instance(): T;
}

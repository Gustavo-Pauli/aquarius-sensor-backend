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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const symbols_1 = require("./symbols");
const api_1 = require("better-auth/api");
const node_1 = require("better-auth/node");
let AuthGuard = class AuthGuard {
    reflector;
    auth;
    constructor(reflector, auth) {
        this.reflector = reflector;
        this.auth = auth;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const session = await this.auth.api.getSession({
            headers: (0, node_1.fromNodeHeaders)(request.headers),
        });
        request.session = session;
        request.user = session?.user ?? null;
        const isPublic = this.reflector.get('PUBLIC', context.getHandler());
        if (isPublic)
            return true;
        const isOptional = this.reflector.get('OPTIONAL', context.getHandler());
        if (isOptional && !session)
            return true;
        if (!session) {
            throw new api_1.APIError(401, {
                code: 'UNAUTHORIZED',
                message: 'Unauthorized',
            });
        }
        return true;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(core_1.Reflector)),
    __param(1, (0, common_1.Inject)(symbols_1.AUTH_INSTANCE_KEY)),
    __metadata("design:paramtypes", [core_1.Reflector, Object])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIErrorExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const better_auth_1 = require("better-auth");
let APIErrorExceptionFilter = class APIErrorExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.statusCode;
        const message = exception.body?.message;
        response.status(status).json({
            statusCode: status,
            message,
        });
    }
};
exports.APIErrorExceptionFilter = APIErrorExceptionFilter;
exports.APIErrorExceptionFilter = APIErrorExceptionFilter = __decorate([
    (0, common_1.Catch)(better_auth_1.APIError)
], APIErrorExceptionFilter);
//# sourceMappingURL=api-error-exception-filter.js.map
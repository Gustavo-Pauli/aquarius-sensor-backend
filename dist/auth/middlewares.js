"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipBodyParsingMiddleware = void 0;
const common_1 = require("@nestjs/common");
const express = require("express");
let SkipBodyParsingMiddleware = class SkipBodyParsingMiddleware {
    use(req, res, next) {
        if (req.baseUrl.startsWith('/api/auth')) {
            next();
            return;
        }
        express.json()(req, res, (err) => {
            if (err) {
                next(err);
                return;
            }
            express.urlencoded({ extended: true })(req, res, next);
        });
    }
};
exports.SkipBodyParsingMiddleware = SkipBodyParsingMiddleware;
exports.SkipBodyParsingMiddleware = SkipBodyParsingMiddleware = __decorate([
    (0, common_1.Injectable)()
], SkipBodyParsingMiddleware);
//# sourceMappingURL=middlewares.js.map
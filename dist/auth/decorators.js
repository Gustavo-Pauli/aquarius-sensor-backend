"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hook = exports.AfterHook = exports.BeforeHook = exports.Session = exports.Optional = exports.Public = void 0;
const common_1 = require("@nestjs/common");
const symbols_1 = require("./symbols");
const Public = () => (0, common_1.SetMetadata)('PUBLIC', true);
exports.Public = Public;
const Optional = () => (0, common_1.SetMetadata)('OPTIONAL', true);
exports.Optional = Optional;
exports.Session = (0, common_1.createParamDecorator)((_data, context) => {
    const request = context.switchToHttp().getRequest();
    return request.session;
});
const BeforeHook = (path) => (0, common_1.SetMetadata)(symbols_1.BEFORE_HOOK_KEY, path);
exports.BeforeHook = BeforeHook;
const AfterHook = (path) => (0, common_1.SetMetadata)(symbols_1.AFTER_HOOK_KEY, path);
exports.AfterHook = AfterHook;
const Hook = () => (0, common_1.SetMetadata)(symbols_1.HOOK_KEY, true);
exports.Hook = Hook;
//# sourceMappingURL=decorators.js.map
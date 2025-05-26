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
exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const messages_service_1 = require("./messages.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const get_messages_query_dto_1 = require("./dto/get-messages-query.dto");
let MessagesController = class MessagesController {
    messagesService;
    constructor(messagesService) {
        this.messagesService = messagesService;
    }
    async create(createMessageDto) {
        return this.messagesService.create(createMessageDto);
    }
    async findAll(query) {
        return this.messagesService.findAll(query);
    }
    async stats(query) {
        const messages = await this.messagesService.findAll(query);
        const temps = messages.map(msg => msg.temperature);
        const count = temps.length;
        const min = count ? Math.min(...temps) : 0;
        const max = count ? Math.max(...temps) : 0;
        const avg = count ? temps.reduce((sum, t) => sum + t, 0) / count : 0;
        return { min, max, avg, count };
    }
    async statsBySensor(sensorId, query) {
        const messages = await this.messagesService.findAll({ ...query, sensorId });
        const temps = messages.map(msg => msg.temperature);
        const count = temps.length;
        const min = count ? Math.min(...temps) : 0;
        const max = count ? Math.max(...temps) : 0;
        const avg = count ? temps.reduce((sum, t) => sum + t, 0) / count : 0;
        return { min, max, avg, count };
    }
    async findBySensor(sensorId) {
        return this.messagesService.findBySensor(sensorId);
    }
    async findOne(id) {
        return this.messagesService.findOne(id);
    }
    async remove(id) {
        return this.messagesService.remove(id);
    }
};
exports.MessagesController = MessagesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.CreateMessageDto]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_messages_query_dto_1.GetMessagesQueryDto]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_messages_query_dto_1.GetMessagesQueryDto]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "stats", null);
__decorate([
    (0, common_1.Get)('sensor/:sensorId/stats'),
    __param(0, (0, common_1.Param)('sensorId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_messages_query_dto_1.GetMessagesQueryDto]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "statsBySensor", null);
__decorate([
    (0, common_1.Get)('sensor/:sensorId'),
    __param(0, (0, common_1.Param)('sensorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "findBySensor", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "remove", null);
exports.MessagesController = MessagesController = __decorate([
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesController);
//# sourceMappingURL=messages.controller.js.map
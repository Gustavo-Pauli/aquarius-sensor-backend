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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const log_schema_1 = require("./schemas/log.schema");
let MessagesService = class MessagesService {
    logModel;
    constructor(logModel) {
        this.logModel = logModel;
    }
    async create(createMessageDto) {
        const created = new this.logModel(createMessageDto);
        return created.save();
    }
    async findAll(query) {
        const filter = {};
        if (query?.sensorId)
            filter.sensorId = query.sensorId;
        if (query?.start || query?.end) {
            const timeFilter = {};
            if (query.start)
                timeFilter.$gte = new Date(query.start);
            if (query.end)
                timeFilter.$lte = new Date(query.end);
            filter.timestamp = timeFilter;
        }
        return this.logModel.find(filter).exec();
    }
    async findBySensor(sensorId) {
        return this.logModel.find({ sensorId }).exec();
    }
    async findOne(id) {
        const log = await this.logModel.findById(id).exec();
        if (!log)
            throw new common_1.NotFoundException(`Message #${id} not found`);
        return log;
    }
    async remove(id) {
        const result = await this.logModel.findByIdAndDelete(id).exec();
        if (!result)
            throw new common_1.NotFoundException(`Message #${id} not found`);
    }
    async stats(query) {
        const match = {};
        if (query?.start || query?.end) {
            match.timestamp = {};
            if (query.start)
                match.timestamp.$gte = new Date(query.start);
            if (query.end)
                match.timestamp.$lte = new Date(query.end);
        }
        const result = await this.logModel.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    min: { $min: '$temperature' },
                    max: { $max: '$temperature' },
                    avg: { $avg: '$temperature' },
                    count: { $sum: 1 },
                },
            },
        ]);
        const stats = result[0] || { min: 0, max: 0, avg: 0, count: 0 };
        return {
            min: stats.min,
            max: stats.max,
            avg: stats.avg,
            count: stats.count,
        };
    }
    async statsBySensor(sensorId, query) {
        const match = { sensorId };
        if (query?.start || query?.end) {
            match.timestamp = {};
            if (query.start)
                match.timestamp.$gte = new Date(query.start);
            if (query.end)
                match.timestamp.$lte = new Date(query.end);
        }
        const result = await this.logModel.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    min: { $min: '$temperature' },
                    max: { $max: '$temperature' },
                    avg: { $avg: '$temperature' },
                    count: { $sum: 1 },
                },
            },
        ]);
        const stats = result[0] || { min: 0, max: 0, avg: 0, count: 0 };
        return {
            min: stats.min,
            max: stats.max,
            avg: stats.avg,
            count: stats.count,
        };
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(log_schema_1.Log.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MessagesService);
//# sourceMappingURL=messages.service.js.map
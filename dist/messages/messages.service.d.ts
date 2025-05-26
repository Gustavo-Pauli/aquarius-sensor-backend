import { Model } from 'mongoose';
import { Log, LogDocument } from './schemas/log.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetMessagesQueryDto } from './dto/get-messages-query.dto';
import { StatsQueryDto } from './dto/stats-query.dto';
export declare class MessagesService {
    private logModel;
    constructor(logModel: Model<LogDocument>);
    create(createMessageDto: CreateMessageDto): Promise<Log>;
    findAll(query?: GetMessagesQueryDto): Promise<Log[]>;
    findBySensor(sensorId: string): Promise<Log[]>;
    findOne(id: string): Promise<Log>;
    remove(id: string): Promise<void>;
    stats(query?: StatsQueryDto): Promise<{
        min: number;
        max: number;
        avg: number;
        count: number;
    }>;
    statsBySensor(sensorId: string, query?: StatsQueryDto): Promise<{
        min: number;
        max: number;
        avg: number;
        count: number;
    }>;
}

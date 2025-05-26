import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Log } from './schemas/log.schema';
import { GetMessagesQueryDto } from './dto/get-messages-query.dto';
import { StatsResponse } from './dto/stats-response.dto';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    create(createMessageDto: CreateMessageDto): Promise<Log>;
    findAll(query: GetMessagesQueryDto): Promise<Log[]>;
    stats(query: GetMessagesQueryDto): Promise<StatsResponse>;
    statsBySensor(sensorId: string, query: GetMessagesQueryDto): Promise<StatsResponse>;
    findBySensor(sensorId: string): Promise<Log[]>;
    findOne(id: string): Promise<Log>;
    remove(id: string): Promise<void>;
}

import { Document } from "mongoose";
export type LogDocument = Log & Document;
export declare class Log {
    sensorId: string;
    temperature: number;
    timestamp: Date;
}
export declare const LogSchema: import("mongoose").Schema<Log, import("mongoose").Model<Log, any, any, any, Document<unknown, any, Log, any> & Log & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Log, Document<unknown, {}, import("mongoose").FlatRecord<Log>, {}> & import("mongoose").FlatRecord<Log> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;

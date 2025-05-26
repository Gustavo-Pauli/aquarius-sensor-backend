import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type LogDocument = Log & Document

@Schema({ timestamps: true })
export class Log {
  @Prop({ required: true })
  sensorId: string

  @Prop({ required: true })
  temperature: number

  @Prop({ required: true, type: Date })
  timestamp: Date
}

export const LogSchema = SchemaFactory.createForClass(Log)

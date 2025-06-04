import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type MessageDocument = Message & Document

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  deviceId: string

  @Prop({ required: true })
  temperature: number

  @Prop({ required: true, type: Date })
  timestamp: Date
}

export const MessageSchema = SchemaFactory.createForClass(Message)

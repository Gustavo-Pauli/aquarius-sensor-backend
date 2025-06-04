import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type AlertDocument = Alert & Document

@Schema({ timestamps: true })
export class Alert {
  @Prop({ required: false })
  deviceId?: string

  @Prop({ required: true })
  threshold: number

  @Prop({ required: true })
  email: string
}

export const AlertSchema = SchemaFactory.createForClass(Alert)

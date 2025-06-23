import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, FilterQuery } from 'mongoose'
import { Message, MessageDocument } from './schemas/message.schema'
import { CreateMessageDto } from './dto/create-message.dto'
import { GetMessagesQueryDto } from './dto/get-messages-query.dto'
import { StatsQueryDto } from './dto/stats-query.dto'
import { AlertsService } from '../alerts/alerts.service'

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private MessagesModel: Model<MessageDocument>,
    private alertsService: AlertsService
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const created = new this.MessagesModel(createMessageDto)
    const saved = await created.save()
    // check alerts and send notifications if needed
    await this.alertsService.checkAndNotify({
      deviceId: saved.deviceId,
      temperature: saved.temperature,
      // timestamp: saved.timestamp,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    })
    return saved
  }

  async findAll(query?: GetMessagesQueryDto): Promise<Message[]> {
    const filter: FilterQuery<MessageDocument> = {}
    if (query?.deviceId) filter.deviceId = query.deviceId
    if (query?.start || query?.end) {
      const timeFilter: Record<string, Date> = {}
      if (query.start) timeFilter.$gte = new Date(query.start)
      if (query.end) timeFilter.$lte = new Date(query.end)
      filter.timestamp = timeFilter as any
    }
    return this.MessagesModel.find(filter).exec()
  }

  async findBySensor(deviceId: string): Promise<Message[]> {
    return this.MessagesModel.find({ deviceId }).exec()
  }

  async findOne(id: string): Promise<Message> {
    const Message = await this.MessagesModel.findById(id).exec()
    if (!Message) throw new NotFoundException(`Message #${id} not found`)
    return Message
  }

  async remove(id: string): Promise<void> {
    const result = await this.MessagesModel.findByIdAndDelete(id).exec()
    if (!result) throw new NotFoundException(`Message #${id} not found`)
  }

  async stats(
    query?: StatsQueryDto
  ): Promise<{ min: number; max: number; avg: number; count: number }> {
    const match: any = {}
    if (query?.start || query?.end) {
      match.timestamp = {}
      if (query.start) match.timestamp.$gte = new Date(query.start)
      if (query.end) match.timestamp.$lte = new Date(query.end)
    }
    const result = await this.MessagesModel.aggregate([
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
    ])
    const stats = result[0] || { min: 0, max: 0, avg: 0, count: 0 }
    return {
      min: stats.min,
      max: stats.max,
      avg: stats.avg,
      count: stats.count,
    }
  }

  async statsBySensor(
    deviceId: string,
    query?: StatsQueryDto
  ): Promise<{ min: number; max: number; avg: number; count: number }> {
    const match: any = { deviceId }
    if (query?.start || query?.end) {
      match.timestamp = {}
      if (query.start) match.timestamp.$gte = new Date(query.start)
      if (query.end) match.timestamp.$lte = new Date(query.end)
    }
    const result = await this.MessagesModel.aggregate([
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
    ])
    const stats = result[0] || { min: 0, max: 0, avg: 0, count: 0 }
    return {
      min: stats.min,
      max: stats.max,
      avg: stats.avg,
      count: stats.count,
    }
  }
}

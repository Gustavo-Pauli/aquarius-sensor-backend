import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, FilterQuery } from 'mongoose'
import { Log, LogDocument } from './schemas/log.schema'
import { CreateMessageDto } from './dto/create-message.dto'
import { GetMessagesQueryDto } from './dto/get-messages-query.dto'
import { StatsQueryDto } from './dto/stats-query.dto'

@Injectable()
// Renamed from LogsService to MessagesService
export class MessagesService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  async create(createMessageDto: CreateMessageDto): Promise<Log> {
    const created = new this.logModel(createMessageDto)
    return created.save()
  }

  async findAll(query?: GetMessagesQueryDto): Promise<Log[]> {
    const filter: FilterQuery<LogDocument> = {}
    if (query?.sensorId) filter.sensorId = query.sensorId
    if (query?.start || query?.end) {
      const timeFilter: Record<string, Date> = {}
      if (query.start) timeFilter.$gte = new Date(query.start)
      if (query.end) timeFilter.$lte = new Date(query.end)
      filter.timestamp = timeFilter as any
    }
    return this.logModel.find(filter).exec()
  }

  async findBySensor(sensorId: string): Promise<Log[]> {
    return this.logModel.find({ sensorId }).exec()
  }

  async findOne(id: string): Promise<Log> {
    const log = await this.logModel.findById(id).exec()
    if (!log) throw new NotFoundException(`Message #${id} not found`)
    return log
  }

  async remove(id: string): Promise<void> {
    const result = await this.logModel.findByIdAndDelete(id).exec()
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
    sensorId: string,
    query?: StatsQueryDto
  ): Promise<{ min: number; max: number; avg: number; count: number }> {
    const match: any = { sensorId }
    if (query?.start || query?.end) {
      match.timestamp = {}
      if (query.start) match.timestamp.$gte = new Date(query.start)
      if (query.end) match.timestamp.$lte = new Date(query.end)
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

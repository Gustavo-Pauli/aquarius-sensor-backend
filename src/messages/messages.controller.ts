import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Body,
  Query,
} from '@nestjs/common'
import { MessagesService } from './messages.service'
import { CreateMessageDto } from './dto/create-message.dto'
import { Log } from './schemas/log.schema'
import { GetMessagesQueryDto } from './dto/get-messages-query.dto'
import { StatsResponse } from './dto/stats-response.dto'

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto): Promise<Log> {
    return this.messagesService.create(createMessageDto)
  }

  @Get()
  async findAll(@Query() query: GetMessagesQueryDto): Promise<Log[]> {
    return this.messagesService.findAll(query)
  }

  @Get('stats')
  async stats(@Query() query: GetMessagesQueryDto): Promise<StatsResponse> {
    const messages = await this.messagesService.findAll(query)
    const temps = messages.map(msg => msg.temperature)
    const count = temps.length
    const min = count ? Math.min(...temps) : 0
    const max = count ? Math.max(...temps) : 0
    const avg = count ? temps.reduce((sum, t) => sum + t, 0) / count : 0
    return { min, max, avg, count }
  }

  @Get('sensor/:sensorId/stats')
  async statsBySensor(
    @Param('sensorId') sensorId: string,
    @Query() query: GetMessagesQueryDto
  ): Promise<StatsResponse> {
    const messages = await this.messagesService.findAll({ ...query, sensorId })
    const temps = messages.map(msg => msg.temperature)
    const count = temps.length
    const min = count ? Math.min(...temps) : 0
    const max = count ? Math.max(...temps) : 0
    const avg = count ? temps.reduce((sum, t) => sum + t, 0) / count : 0
    return { min, max, avg, count }
  }

  @Get('sensor/:sensorId')
  async findBySensor(@Param('sensorId') sensorId: string): Promise<Log[]> {
    return this.messagesService.findBySensor(sensorId)
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Log> {
    return this.messagesService.findOne(id)
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.messagesService.remove(id)
  }
}

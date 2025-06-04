import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common'
import { MessagesService } from './messages.service'
import { CreateMessageDto } from './dto/create-message.dto'
import { Message } from './schemas/message.schema'
import { GetMessagesQueryDto } from './dto/get-messages-query.dto'
import { StatsResponse } from './dto/stats-response.dto'
import { Public } from 'src/auth/decorators'
import { ApiKeyGuard } from 'src/auth/api-key.guard'

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @Public()
  @UseGuards(ApiKeyGuard)
  async create(@Body() createMessageDto: CreateMessageDto): Promise<Message> {
    console.log('Creating message:', createMessageDto)
    return this.messagesService.create(createMessageDto)
  }

  @Get()
  async findAll(@Query() query: GetMessagesQueryDto): Promise<Message[]> {
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

  @Get('sensor/:deviceId/stats')
  async statsBySensor(
    @Param('deviceId') deviceId: string,
    @Query() query: GetMessagesQueryDto
  ): Promise<StatsResponse> {
    const messages = await this.messagesService.findAll({ ...query, deviceId })
    const temps = messages.map(msg => msg.temperature)
    const count = temps.length
    const min = count ? Math.min(...temps) : 0
    const max = count ? Math.max(...temps) : 0
    const avg = count ? temps.reduce((sum, t) => sum + t, 0) / count : 0
    return { min, max, avg, count }
  }

  @Get('sensor/:deviceId')
  async findBySensor(@Param('deviceId') deviceId: string): Promise<Message[]> {
    return this.messagesService.findBySensor(deviceId)
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Message> {
    return this.messagesService.findOne(id)
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.messagesService.remove(id)
  }
}

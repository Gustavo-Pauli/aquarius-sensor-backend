import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common'
import { AlertsService } from './alerts.service'
import { CreateAlertDto } from './dto/create-alert.dto'
import { Alert } from './schemas/alert.schema'

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  async create(@Body() dto: CreateAlertDto): Promise<Alert> {
    return this.alertsService.create(dto)
  }

  @Get()
  async findAll(): Promise<Alert[]> {
    return this.alertsService.findAll()
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.alertsService.remove(id)
  }
}

import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'
import { Alert, AlertDocument } from './schemas/alert.schema'
import { CreateAlertDto } from './dto/create-alert.dto'

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name)
  private readonly resend: Resend

  constructor(
    @InjectModel(Alert.name) private alertModel: Model<AlertDocument>,
    private configService: ConfigService
  ) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY')
    this.resend = new Resend(apiKey)
  }

  async create(dto: CreateAlertDto): Promise<Alert> {
    const created = new this.alertModel(dto)
    return created.save()
  }

  async findAll(): Promise<Alert[]> {
    return this.alertModel.find().exec()
  }

  async remove(id: string): Promise<void> {
    const result = await this.alertModel.findByIdAndDelete(id).exec()
    if (!result) throw new NotFoundException(`Alert #${id} not found`)
  }

  async checkAndNotify(message: {
    deviceId?: string
    temperature: number
    timestamp: Date
  }) {
    const query: any = { threshold: { $gt: message.temperature } }
    if (message.deviceId) {
      query.$or = [
        { deviceId: { $exists: false } },
        { deviceId: message.deviceId },
      ]
    }
    const alerts = await this.alertModel.find(query).exec()
    for (const alert of alerts) {
      try {
        await this.resend.emails.send({
          from: 'onboarding@resend.dev',
          to: alert.email,
          subject: `Alert: temp below ${alert.threshold}`,
          html: `<p>Sensor ${message.deviceId || 'N/A'} reported ${message.temperature} at ${message.timestamp}. Below threshold ${alert.threshold}.</p>`,
        })
      } catch (err) {
        this.logger.error('Failed to send alert email', err)
      }
    }
  }
}

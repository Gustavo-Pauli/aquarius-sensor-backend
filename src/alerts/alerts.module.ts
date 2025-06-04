import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { Alert, AlertSchema } from './schemas/alert.schema'
import { AlertsService } from './alerts.service'
import { AlertsController } from './alerts.controller'
import { ApiKeyGuard } from '../auth/api-key.guard'

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Alert.name, schema: AlertSchema }]),
  ],
  controllers: [AlertsController],
  providers: [AlertsService, ApiKeyGuard],
  exports: [AlertsService],
})
export class AlertsModule {}

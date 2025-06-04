import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MessagesService } from './messages.service'
import { MessagesController } from './messages.controller'
import { MessageSchema } from './schemas/message.schema'
import { ApiKeyGuard } from '../auth/api-key.guard'
import { AlertsModule } from '../alerts/alerts.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    AlertsModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService, ApiKeyGuard],
})
export class MessagesModule {}

import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MessagesService } from './messages.service'
import { MessagesController } from './messages.controller'
import { LogSchema } from './schemas/log.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Log', schema: LogSchema }])],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}

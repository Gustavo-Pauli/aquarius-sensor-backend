import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MessagesModule } from './messages/messages.module'
import { AuthModule } from './auth/auth.module'
import { AlertsModule } from './alerts/alerts.module'
import { AppController } from './app.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGO_URI')
        if (!mongoUri) {
          throw new Error('MONGO_URI environment variable is not defined')
        }
        return {
          uri: mongoUri,
        }
      },
    }),
    MessagesModule,
    AuthModule.forRoot({
      disableExceptionFilter: true,
      disableTrustedOriginsCors: true,
    }),
    AlertsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  try {
    console.log('Starting application with env:', {
      PORT: process.env.PORT,
      TRUSTED_ORIGINS: process.env.TRUSTED_ORIGINS,
      MONGO_URI: process.env.MONGO_URI ? '*****' : undefined,
    })
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      bodyParser: false,
    })

    app.set('query parser', 'extended')
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

    const configService = app.get(ConfigService)
    const port = configService.get<number>('PORT') ?? 3000

    // Disable all CORS restrictions for testing
    app.enableCors({
      origin: true, // Allow all origins
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['*'], // Allow all headers
      exposedHeaders: ['*'], // Expose all headers
    })

    await app.listen(port, '0.0.0.0')
    console.log(`Application is running on http://0.0.0.0:${port}`)
  } catch (err) {
    console.error('Error during app bootstrap:', err)
    process.exit(1)
  }
}

void bootstrap()

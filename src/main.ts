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

    // Enable CORS with specific configuration
    app.enableCors({
      origin: (origin, callback) => {
        const configService = app.get(ConfigService)
        const trustedOriginsEnv = configService.get<string>(
          'TRUSTED_ORIGINS',
          ''
        )
        const trustedOrigins = trustedOriginsEnv
          ? trustedOriginsEnv.split(',')
          : []

        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true)

        // Check if the origin is in the trusted origins list
        if (trustedOrigins.includes(origin)) {
          return callback(null, true)
        }

        callback(new Error('Not allowed by CORS'))
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    })

    app.set('query parser', 'extended')
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

    const configService = app.get(ConfigService)
    const port = configService.get<number>('PORT') ?? 8000

    await app.listen(port, '0.0.0.0')
    console.log(`Application is running on http://0.0.0.0:${port}`)
  } catch (err) {
    console.error('Error during app bootstrap:', err)
    process.exit(1)
  }
}

void bootstrap()

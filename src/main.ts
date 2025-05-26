import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  })

  app.set('query parser', 'extended')
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT') ?? 3000

  const trustedOrigins = (process.env.TRUSTED_ORIGINS as string).split(',')

  app.enableCors({
    origin: trustedOrigins,
    credentials: true,
  })

  // app.setGlobalPrefix('api', { exclude: ['/api/auth/{*path}'] })

  await app.listen(port)
}

void bootstrap()

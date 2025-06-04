import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const apiKey = request.headers['x-api-key'] as string
    const validKey = this.configService.get<string>('IOT_SECRET')
    if (!apiKey || apiKey !== validKey) {
      throw new UnauthorizedException('Invalid API key')
    }
    return true
  }
}

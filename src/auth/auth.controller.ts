import { All, Controller, Inject, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { toNodeHandler } from 'better-auth/node'
import { Auth } from 'better-auth'
import { AUTH_INSTANCE_KEY } from './symbols'

@Controller('api/auth')
export class AuthController {
  private handler: ReturnType<typeof toNodeHandler>

  constructor(@Inject(AUTH_INSTANCE_KEY) private readonly auth: Auth) {
    this.handler = toNodeHandler(this.auth)
  }

  @All('*path')
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    return this.handler(req, res)
  }

  @All('')
  async handleAuthRoot(@Req() req: Request, @Res() res: Response) {
    return this.handler(req, res)
  }
}

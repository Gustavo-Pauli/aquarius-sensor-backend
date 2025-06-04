import { Controller, Get } from '@nestjs/common'
import { Public, Optional, Session } from './auth/decorators'

@Controller()
export class AppController {
  @Get()
  @Public()
  getHello(@Session() session: any) {
    return { message: 'Hello!', loggedIn: Boolean(session) }
  }
}

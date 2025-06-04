import { Controller, Get } from '@nestjs/common'
import { Public } from './auth/decorators'

@Controller()
export class AppController {
  @Get()
  @Public()
  getHello() {
    return { message: 'Hello!' }
  }
}

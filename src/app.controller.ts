import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Body } from '@nestjs/common';
import { writeFileSync } from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('messages')
  receiveMessage(@Body() body: any): string {
    console.log('Received message:', body);
    // Append message to avoid replacing existing content
    writeFileSync('messages.txt', JSON.stringify(body) + '\n', { flag: 'a' });
    console.log('Saved message to file');
    return 'Message saved successfully';
  }
}

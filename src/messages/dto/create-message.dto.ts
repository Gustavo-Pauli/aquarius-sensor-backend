import { IsString, IsNumber, IsDate } from 'class-validator'
import { Type } from 'class-transformer'

// Renamed from CreateLogDto to CreateMessageDto
export class CreateMessageDto {
  @IsString()
  sensorId: string

  @IsNumber()
  @Type(() => Number)
  temperature: number

  @IsDate()
  @Type(() => Date)
  timestamp: Date
}

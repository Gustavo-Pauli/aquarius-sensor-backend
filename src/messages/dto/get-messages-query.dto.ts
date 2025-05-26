import { IsOptional, IsString, IsDateString } from 'class-validator'

export class GetMessagesQueryDto {
  @IsOptional()
  @IsString()
  sensorId?: string

  @IsOptional()
  @IsDateString()
  start?: string

  @IsOptional()
  @IsDateString()
  end?: string
}

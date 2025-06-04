import { IsOptional, IsString, IsDateString } from 'class-validator'

export class GetMessagesQueryDto {
  @IsOptional()
  @IsString()
  deviceId?: string

  @IsOptional()
  @IsDateString()
  start?: string

  @IsOptional()
  @IsDateString()
  end?: string
}

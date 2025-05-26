import { IsOptional, IsDateString } from "class-validator"

export class StatsQueryDto {
  @IsOptional()
  @IsDateString()
  start?: string

  @IsOptional()
  @IsDateString()
  end?: string
}

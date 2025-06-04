import { IsEmail, IsNumber, IsOptional } from 'class-validator'

export class CreateAlertDto {
  @IsOptional()
  sensorId?: string

  @IsNumber()
  threshold: number

  @IsEmail()
  email: string
}

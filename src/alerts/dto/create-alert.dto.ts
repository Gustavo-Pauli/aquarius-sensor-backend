import { IsEmail, IsNumber, IsOptional } from 'class-validator'

export class CreateAlertDto {
  @IsOptional()
  deviceId?: string

  @IsNumber()
  threshold: number

  @IsEmail()
  email: string
}

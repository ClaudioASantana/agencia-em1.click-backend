import { IsString, IsOptional, IsDateString, IsInt } from 'class-validator';

export class CreateSweepstakeDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsInt()
  @IsOptional()
  prizeQuantity?: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}

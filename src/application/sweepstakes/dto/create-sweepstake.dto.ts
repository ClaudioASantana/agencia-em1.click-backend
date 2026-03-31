import { IsString, IsNotEmpty, IsOptional, IsDateString, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSweepstakeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  prizeQuantity?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  prizeDesc?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  discountDesc?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

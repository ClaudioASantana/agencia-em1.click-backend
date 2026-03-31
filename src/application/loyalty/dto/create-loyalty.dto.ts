import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDecimal } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoyaltyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  customerEmail: string;

  @ApiProperty()
  @IsNumber()
  points: number;

  @ApiProperty({ required: false })
  @IsDecimal()
  @IsOptional()
  value?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}

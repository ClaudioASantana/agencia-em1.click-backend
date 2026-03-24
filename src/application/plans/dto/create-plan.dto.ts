import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanDto {
  @ApiProperty({ example: 'Estande' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Presença na vitrine digital', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 55, required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ example: 7, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  trialDays?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  maxPublications: number;

  @ApiProperty({ example: 20 })
  @IsInt()
  @Min(1)
  maxOffersPerPub: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(1)
  maxEstablishments: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  allowsHighlight?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  allowsAnalytics?: boolean;
}

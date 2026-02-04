import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOfferDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  price?: string;

  @ApiProperty({
    description: 'Original price before discount',
    required: false,
  })
  @IsString()
  @IsOptional()
  originalPrice?: string;

  @ApiProperty({
    description: 'Discount percentage',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  discountPercentage?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiProperty({ description: 'Highlight on homepage', default: false })
  @IsBoolean()
  @IsOptional()
  highlight?: boolean;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty()
  @IsNumber()
  establishmentId: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  publicationId?: number;
}

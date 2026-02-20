import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class UpdateEstablishmentDto {
  @ApiProperty({
    description: 'The name of the establishment',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'A brief description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'URL of the main image', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ description: 'URL of the logo', required: false })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({ description: 'Contact phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'WhatsApp contact number', required: false })
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @ApiProperty({ description: 'Physical address', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'State (UF)', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'City name', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ description: 'Operating hours text', required: false })
  @IsOptional()
  @IsString()
  hours?: string;

  @ApiProperty({ description: 'List of specialties', required: false })
  @IsOptional()
  @IsArray()
  specialties?: string[];

  @ApiProperty({
    description: 'Instagram handle (@username or URL)',
    required: false,
  })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiProperty({ description: 'Facebook page URL', required: false })
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiProperty({ description: 'Website URL', required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ description: 'Latitude', required: false })
  @IsOptional()
  latitude?: number;

  @ApiProperty({ description: 'Longitude', required: false })
  @IsOptional()
  longitude?: number;

  @ApiProperty({ description: 'Segment ID', required: false })
  @IsOptional()
  @IsNumber()
  segmentId?: number;

  @ApiProperty({ description: 'Location ID', required: false })
  @IsOptional()
  @IsNumber()
  locationId?: number;

  @ApiProperty({ description: 'Show offer prices in vitrine', required: false })
  @IsOptional()
  @IsBoolean()
  showPrice?: boolean;
}

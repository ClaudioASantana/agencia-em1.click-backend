import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateEstablishmentDto {
  @ApiProperty({
    description: 'The name of the establishment',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'A brief description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'URL slug', required: false })
  @IsOptional()
  @IsString()
  slug?: string;

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
  @IsNumber()
  latitude?: number;

  @ApiProperty({ description: 'Longitude', required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ description: 'Location ID', required: true })
  @IsNotEmpty()
  @IsNumber()
  locationId: number;

  @ApiProperty({ description: 'Segment ID', required: true })
  @IsNotEmpty()
  @IsNumber()
  segmentId: number;

  @ApiProperty({
    description: 'Show offer prices in vitrine',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  showPrice?: boolean;
}

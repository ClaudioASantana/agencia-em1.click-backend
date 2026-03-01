import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  IsEnum,
  Min,
  ValidateIf,
} from 'class-validator';

export enum QrTemplateMode {
  STORE = 'STORE',
  CITY_SEGMENT = 'CITY_SEGMENT',
  STORES = 'STORES',
}

export class CreateTemplateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  totalSlots: number;

  @IsOptional()
  @IsEnum(QrTemplateMode)
  mode?: QrTemplateMode;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsInt()
  @ValidateIf((o, v) => v !== null)
  locationId?: number | null;

  @IsOptional()
  @IsInt()
  establishmentId?: number;

  @IsOptional()
  @IsInt({ each: true })
  segmentIds?: number[];
}

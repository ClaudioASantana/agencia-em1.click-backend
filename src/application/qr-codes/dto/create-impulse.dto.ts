import { IsInt, IsOptional, IsArray, ArrayMinSize } from 'class-validator';

export class CreateImpulseDto {
  @IsInt()
  templateId: number;

  // Modo STORE
  @IsOptional()
  @IsInt()
  establishmentId?: number;

  // Modo CITY_SEGMENT
  @IsOptional()
  @IsInt()
  locationId?: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  segmentIds?: number[];
}

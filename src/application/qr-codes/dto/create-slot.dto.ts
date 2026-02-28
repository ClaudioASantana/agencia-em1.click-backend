import { IsString, IsInt, IsEnum, Min, IsOptional } from 'class-validator';

export enum QrTargetType {
  STORE = 'STORE',
  PROMOTIONS = 'PROMOTIONS',
  PUBLICATIONS = 'PUBLICATIONS',
  CITY = 'CITY',
  SEGMENT = 'SEGMENT',
}

export class CreateSlotDto {
  @IsInt()
  @Min(1)
  position: number;

  @IsString()
  label: string;

  @IsEnum(QrTargetType)
  targetType: QrTargetType;

  @IsInt()
  @IsOptional()
  segmentId?: number;
}

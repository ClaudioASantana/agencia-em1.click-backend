import { IsString, IsInt, IsEnum, Min } from 'class-validator';

export enum QrTargetType {
  STORE = 'STORE',
  PROMOTIONS = 'PROMOTIONS',
  PUBLICATIONS = 'PUBLICATIONS',
  CITY = 'CITY',
}

export class CreateSlotDto {
  @IsInt()
  @Min(1)
  position: number;

  @IsString()
  label: string;

  @IsEnum(QrTargetType)
  targetType: QrTargetType;
}
